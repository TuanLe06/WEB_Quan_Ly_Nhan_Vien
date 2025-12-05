const db = require('../config/database');

// Lấy thông tin dashboard cho nhân viên
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const { ma_nv } = req.params;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // --- Tính tháng trước ---
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear--;
    }

    // 1. Thông tin cá nhân
    const [employee] = await db.query(`
      SELECT 
        nv.ma_nv, nv.ten_nv, nv.email, nv.so_dien_thoai,
        nv.ngay_sinh, nv.gioi_tinh, nv.ngay_vao_lam, nv.luong_co_ban,
        pb.ten_phong, pb.ma_phong, cv.ten_chuc_vu, cv.ma_chuc_vu,
        TIMESTAMPDIFF(YEAR, nv.ngay_sinh, CURDATE()) as tuoi,
        TIMESTAMPDIFF(YEAR, nv.ngay_vao_lam, CURDATE()) as nam_cong_tac
      FROM NHANVIEN nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE nv.ma_nv = ? AND nv.trang_thai = 1
    `, [ma_nv]);

    if (employee.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    }

    // 2. Chấm công tháng này
    const [attendanceStats] = await db.query(`
      SELECT 
        COUNT(*) as so_ngay_lam,
        COALESCE(SUM(so_gio), 0) as tong_gio,
        COALESCE(AVG(so_gio), 0) as gio_trung_binh,
        COUNT(CASE WHEN trang_thai = 'Đi muộn' THEN 1 END) as di_muon,
        COUNT(CASE WHEN trang_thai = 'Về sớm' THEN 1 END) as ve_som
      FROM CHAMCONG
      WHERE ma_nv = ? AND MONTH(ngay_lam) = ? AND YEAR(ngay_lam) = ?
    `, [ma_nv, currentMonth, currentYear]);

    // ⭐️ 2.1 Chấm công tháng trước
    const [attendancePrev] = await db.query(`
      SELECT 
        COUNT(*) as so_ngay_lam,
        COALESCE(SUM(so_gio), 0) as tong_gio,
        COALESCE(AVG(so_gio), 0) as gio_trung_binh,
        COUNT(CASE WHEN trang_thai = 'Đi muộn' THEN 1 END) as di_muon,
        COUNT(CASE WHEN trang_thai = 'Về sớm' THEN 1 END) as ve_som
      FROM CHAMCONG
      WHERE ma_nv = ? AND MONTH(ngay_lam) = ? AND YEAR(ngay_lam) = ?
    `, [ma_nv, prevMonth, prevYear]);

    // 3. Chấm công hôm nay
    const [todayAttendance] = await db.query(`
      SELECT * FROM CHAMCONG WHERE ma_nv = ? AND ngay_lam = CURDATE()
    `, [ma_nv]);

    // 4. Lịch sử 7 ngày
    const [recentAttendance] = await db.query(`
      SELECT ngay_lam, gio_vao, gio_ra, so_gio, trang_thai
      FROM CHAMCONG WHERE ma_nv = ?
      ORDER BY ngay_lam DESC LIMIT 7
    `, [ma_nv]);

    // 5. Nghỉ phép
    const [leaveStats] = await db.query(`
      SELECT 
        COUNT(CASE WHEN trang_thai = 'Đã duyệt' THEN 1 END) as da_duyet,
        COUNT(CASE WHEN trang_thai = 'Chờ duyệt' THEN 1 END) as cho_duyet,
        COUNT(CASE WHEN trang_thai = 'Từ chối' THEN 1 END) as tu_choi,
        COUNT(CASE WHEN trang_thai = 'Đã duyệt' AND YEAR(ngay_bat_dau) = ? THEN 1 END) as da_nghi_nam_nay
      FROM NGHIPHEP WHERE ma_nv = ?
    `, [currentYear, ma_nv]);

    // 6. Đơn nghỉ gần nhất
    const [recentLeaves] = await db.query(`
      SELECT id, ngay_bat_dau, ngay_ket_thuc, loai_phep, ly_do, trang_thai, ngay_tao,
        DATEDIFF(ngay_ket_thuc, ngay_bat_dau) + 1 as so_ngay
      FROM NGHIPHEP WHERE ma_nv = ?
      ORDER BY ngay_tao DESC LIMIT 5
    `, [ma_nv]);

    // 7. Lương tháng gần nhất
    const [latestSalary] = await db.query(`
      SELECT thang, nam, tong_gio, luong_co_ban_thoi_diem as luong_co_ban,
        luong_them, tru_luong, luong_thuc_nhan, ngay_tinh
      FROM LUONG WHERE ma_nv = ?
      ORDER BY nam DESC, thang DESC LIMIT 1
    `, [ma_nv]);

    // ⭐️ 7.1 Lương tháng trước
    const [previousSalary] = await db.query(`
      SELECT thang, nam, tong_gio, luong_co_ban_thoi_diem as luong_co_ban,
        luong_them, tru_luong, luong_thuc_nhan, ngay_tinh
      FROM LUONG 
      WHERE ma_nv = ? AND thang = ? AND nam = ?
      LIMIT 1
    `, [ma_nv, prevMonth, prevYear]);

    // 8. Lịch sử lương 6 tháng
    const [salaryHistory] = await db.query(`
      SELECT thang, nam, tong_gio, luong_thuc_nhan
      FROM LUONG WHERE ma_nv = ?
      ORDER BY nam DESC, thang DESC LIMIT 6
    `, [ma_nv]);

    // 9. Hợp đồng
    const [currentContract] = await db.query(`
      SELECT id, loai_hop_dong, ngay_bat_dau, ngay_ket_thuc, luong_co_ban, phu_cap,
        DATEDIFF(COALESCE(ngay_ket_thuc, DATE_ADD(CURDATE(), INTERVAL 1 YEAR)), CURDATE()) as ngay_con_lai
      FROM HOPDONG WHERE ma_nv = ?
        AND ngay_bat_dau <= CURDATE()
        AND (ngay_ket_thuc IS NULL OR ngay_ket_thuc >= CURDATE())
      ORDER BY ngay_bat_dau DESC LIMIT 1
    `, [ma_nv]);

    // 10. Thông báo
    const notifications = [];
    if (attendanceStats[0].di_muon > 3) {
      notifications.push({
        type: 'warning',
        title: 'Cảnh báo đi muộn',
        message: `Bạn đã đi muộn ${attendanceStats[0].di_muon} lần trong tháng này`
      });
    }
    if (attendanceStats[0].tong_gio < 40) {
      const gioThieu = 40 - attendanceStats[0].tong_gio;
      notifications.push({
        type: 'danger',
        title: 'Thiếu giờ làm việc',
        message: `Bạn đang thiếu ${gioThieu.toFixed(1)} giờ so với chuẩn 40h/tháng`
      });
    }
    if (currentContract.length > 0 && currentContract[0].ngay_con_lai <= 30 && currentContract[0].ngay_con_lai > 0) {
      notifications.push({
        type: 'warning',
        title: 'Hợp đồng sắp hết hạn',
        message: `Hợp đồng của bạn sẽ hết hạn sau ${currentContract[0].ngay_con_lai} ngày`
      });
    }
    if (leaveStats[0].cho_duyet > 0) {
      notifications.push({
        type: 'info',
        title: 'Đơn nghỉ phép',
        message: `Bạn có ${leaveStats[0].cho_duyet} đơn nghỉ phép đang chờ duyệt`
      });
    }

    // --- Response ---
    res.json({
      success: true,
      data: {
        employee: employee[0],
        attendance: {
          current: attendanceStats[0],
          previous: attendancePrev[0],   // ⭐️ Thêm vào API
          today: todayAttendance[0] || null,
          recent: recentAttendance
        },
        leave: {
          ...leaveStats[0],
          recent: recentLeaves
        },
        salary: {
          latest: latestSalary[0] || null,
          previous: previousSalary[0] || null, // ⭐️ Thêm vào API
          history: salaryHistory.reverse()
        },
        contract: currentContract[0] || null,
        notifications: notifications,
        summary: {
          gio_lam_thang_nay: attendanceStats[0].tong_gio,
          gio_con_lai: Math.max(0, 40 - attendanceStats[0].tong_gio),
          ngay_phep_da_dung: leaveStats[0].da_nghi_nam_nay,
          ngay_phep_con_lai: Math.max(0, 12 - leaveStats[0].da_nghi_nam_nay)
        }
      }
    });

  } catch (error) {
    console.error('Get employee dashboard error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
