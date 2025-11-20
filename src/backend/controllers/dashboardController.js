const db = require('../config/database');

// Lấy thống kê tổng quan cho Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Tổng số nhân viên
    const [totalEmp] = await db.query(
      'SELECT COUNT(*) as total FROM NHANVIEN WHERE trang_thai = 1'
    );

    // Tổng số phòng ban
    const [totalDept] = await db.query(
      'SELECT COUNT(*) as total FROM PHONGBAN WHERE trang_thai = 1'
    );

    // Số nhân viên đã chấm công hôm nay
    const [checkedIn] = await db.query(
      'SELECT COUNT(*) as total FROM CHAMCONG WHERE ngay_lam = ?',
      [today]
    );

    // Yêu cầu nghỉ phép chờ duyệt
    const [pendingLeave] = await db.query(
      "SELECT COUNT(*) as total FROM NGHIPHEP WHERE trang_thai = 'Chờ duyệt'"
    );

    // Tổng quỹ lương tháng này
    const [totalSalary] = await db.query(
      'SELECT COALESCE(SUM(luong_thuc_nhan), 0) as total FROM LUONG WHERE thang = ? AND nam = ?',
      [currentMonth, currentYear]
    );

    // Hợp đồng sắp hết hạn (30 ngày)
    const [expiringContracts] = await db.query(`
      SELECT COUNT(*) as total FROM HOPDONG 
      WHERE ngay_ket_thuc BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    // Nhân viên mới trong tháng
    const [newEmployees] = await db.query(`
      SELECT COUNT(*) as total FROM NHANVIEN 
      WHERE MONTH(ngay_vao_lam) = ? AND YEAR(ngay_vao_lam) = ? AND trang_thai = 1
    `, [currentMonth, currentYear]);

    // Nhân viên đang nghỉ phép hôm nay
    const [onLeaveToday] = await db.query(`
      SELECT COUNT(*) as total FROM NGHIPHEP 
      WHERE ? BETWEEN ngay_bat_dau AND ngay_ket_thuc AND trang_thai = 'Đã duyệt'
    `, [today]);

    res.json({
      success: true,
      data: {
        tongNhanVien: totalEmp[0].total,
        tongPhongBan: totalDept[0].total,
        daChamCong: checkedIn[0].total,
        yeuCauNghiPhep: pendingLeave[0].total,
        tongLuongThang: totalSalary[0].total,
        hopDongSapHetHan: expiringContracts[0].total,
        nhanVienMoi: newEmployees[0].total,
        nghiPhepHomNay: onLeaveToday[0].total
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê nhân viên theo phòng ban
exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        pb.ma_phong,
        pb.ten_phong,
        COUNT(nv.ma_nv) as so_luong,
        COUNT(CASE WHEN nv.gioi_tinh = 'Nam' THEN 1 END) as nam,
        COUNT(CASE WHEN nv.gioi_tinh = 'Nữ' THEN 1 END) as nu
      FROM PHONGBAN pb
      LEFT JOIN NHANVIEN nv ON pb.ma_phong = nv.ma_phong AND nv.trang_thai = 1
      WHERE pb.trang_thai = 1
      GROUP BY pb.ma_phong, pb.ten_phong
      ORDER BY so_luong DESC
    `);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get employees by department error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê nhân viên theo chức vụ
exports.getEmployeesByPosition = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        cv.ma_chuc_vu,
        cv.ten_chuc_vu,
        COUNT(nv.ma_nv) as so_luong
      FROM CHUCVU cv
      LEFT JOIN NHANVIEN nv ON cv.ma_chuc_vu = nv.ma_chucvu AND nv.trang_thai = 1
      GROUP BY cv.ma_chuc_vu, cv.ten_chuc_vu
      ORDER BY so_luong DESC
    `);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get employees by position error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Quỹ lương 6 tháng gần nhất
exports.getSalaryTrend = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const [trend] = await db.query(`
      SELECT 
        thang,
        nam,
        COUNT(DISTINCT ma_nv) as so_nhan_vien,
        SUM(luong_thuc_nhan) as tong_luong,
        AVG(luong_thuc_nhan) as luong_tb
      FROM LUONG
      WHERE nam = ? OR (nam = ? AND thang <= MONTH(CURDATE()))
      GROUP BY nam, thang
      ORDER BY nam DESC, thang DESC
      LIMIT 6
    `, [currentYear, currentYear]);

    res.json({
      success: true,
      data: trend.reverse() // Đảo ngược để hiển thị từ cũ đến mới
    });
  } catch (error) {
    console.error('Get salary trend error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê chấm công tháng này
exports.getAttendanceStats = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [stats] = await db.query(`
      SELECT 
        COUNT(DISTINCT nv.ma_nv) as tong_nhan_vien,
        COUNT(DISTINCT cc.ma_nv) as da_cham_cong,
        COUNT(cc.id) as tong_ngay_cong,
        COALESCE(SUM(cc.so_gio), 0) as tong_gio_lam,
        COALESCE(AVG(cc.so_gio), 0) as gio_tb
      FROM NHANVIEN nv
      LEFT JOIN CHAMCONG cc ON nv.ma_nv = cc.ma_nv
        AND MONTH(cc.ngay_lam) = ?
        AND YEAR(cc.ngay_lam) = ?
      WHERE nv.trang_thai = 1
    `, [currentMonth, currentYear]);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Top 10 nhân viên chăm chỉ nhất
exports.getTopEmployees = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [employees] = await db.query(`
      SELECT 
        nv.ma_nv,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        COUNT(cc.id) as so_ngay_lam,
        COALESCE(SUM(cc.so_gio), 0) as tong_gio,
        COALESCE(AVG(cc.so_gio), 0) as gio_tb
      FROM NHANVIEN nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      LEFT JOIN CHAMCONG cc ON nv.ma_nv = cc.ma_nv
        AND MONTH(cc.ngay_lam) = ?
        AND YEAR(cc.ngay_lam) = ?
      WHERE nv.trang_thai = 1
      GROUP BY nv.ma_nv, nv.ten_nv, pb.ten_phong, cv.ten_chuc_vu
      HAVING tong_gio > 0
      ORDER BY tong_gio DESC
      LIMIT 10
    `, [currentMonth, currentYear]);

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Get top employees error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Thống kê nghỉ phép tháng này
exports.getLeaveStats = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as tong_yeu_cau,
        COUNT(CASE WHEN trang_thai = 'Chờ duyệt' THEN 1 END) as cho_duyet,
        COUNT(CASE WHEN trang_thai = 'Đã duyệt' THEN 1 END) as da_duyet,
        COUNT(CASE WHEN trang_thai = 'Từ chối' THEN 1 END) as tu_choi,
        COALESCE(SUM(CASE WHEN trang_thai = 'Đã duyệt' THEN DATEDIFF(ngay_ket_thuc, ngay_bat_dau) + 1 END), 0) as tong_ngay_nghi
      FROM NGHIPHEP
      WHERE MONTH(ngay_bat_dau) = ? AND YEAR(ngay_bat_dau) = ?
    `, [currentMonth, currentYear]);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get leave stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Hoạt động gần đây
exports.getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Lấy các hoạt động gần đây
    const activities = [];

    // Nhân viên mới
    const [newEmployees] = await db.query(`
      SELECT 
        ma_nv, ten_nv, ngay_vao_lam as ngay,
        'new_employee' as loai,
        CONCAT('Nhân viên mới: ', ten_nv) as mo_ta
      FROM NHANVIEN
      WHERE trang_thai = 1
      ORDER BY ngay_vao_lam DESC
      LIMIT 5
    `);
    activities.push(...newEmployees);

    // Yêu cầu nghỉ phép mới
    const [newLeaves] = await db.query(`
      SELECT 
        np.id, nv.ten_nv, np.ngay_tao as ngay,
        'leave_request' as loai,
        CONCAT(nv.ten_nv, ' gửi yêu cầu nghỉ phép') as mo_ta
      FROM NGHIPHEP np
      JOIN NHANVIEN nv ON np.ma_nv = nv.ma_nv
      ORDER BY np.ngay_tao DESC
      LIMIT 5
    `);
    activities.push(...newLeaves);

    // Hợp đồng mới
    const [newContracts] = await db.query(`
      SELECT 
        hd.id, nv.ten_nv, hd.ngay_tao as ngay,
        'new_contract' as loai,
        CONCAT('Ký hợp đồng: ', nv.ten_nv) as mo_ta
      FROM HOPDONG hd
      JOIN NHANVIEN nv ON hd.ma_nv = nv.ma_nv
      ORDER BY hd.ngay_tao DESC
      LIMIT 5
    `);
    activities.push(...newContracts);

    // Sắp xếp theo thời gian
    activities.sort((a, b) => new Date(b.ngay) - new Date(a.ngay));

    res.json({
      success: true,
      data: activities.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};