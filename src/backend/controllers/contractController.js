// ================== contractController.js ==================
const db = require('../config/database');

// ================= Thêm hợp đồng mới =================
exports.createContract = async (req, res) => {
  try {
    // Multer đã parse FormData và đưa text fields vào req.body
    const { ma_nv, loai_hop_dong, ngay_bat_dau, ngay_ket_thuc } = req.body;
    const file_hop_dong = req.file?.filename || null;

    // Log để debug - XEM BACKEND NHẬN ĐƯỢC GÌ
    console.log('===== CREATE CONTRACT DEBUG =====');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('Extracted data:', { ma_nv, loai_hop_dong, ngay_bat_dau, ngay_ket_thuc, file_hop_dong });
    console.log('================================');

    // Validate dữ liệu bắt buộc
    if (!ma_nv || !loai_hop_dong || !ngay_bat_dau) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin (mã nhân viên, loại hợp đồng, ngày bắt đầu)' 
      });
    }

    // Kiểm tra nhân viên tồn tại
    const [employee] = await db.query(
      'SELECT * FROM NHANVIEN WHERE ma_nv = ?',
      [ma_nv]
    );

    if (employee.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Nhân viên không tồn tại' 
      });
    }

    // Kiểm tra ngày hợp lệ - CHỈ khi ngay_ket_thuc có giá trị và không phải empty string
    if (ngay_ket_thuc && ngay_ket_thuc.trim() !== '') {
      if (new Date(ngay_ket_thuc) < new Date(ngay_bat_dau)) {
        return res.status(400).json({ 
          success: false,
          message: 'Ngày kết thúc phải sau ngày bắt đầu' 
        });
      }
    }

    // Chuẩn bị giá trị ngay_ket_thuc: null nếu rỗng
    const finalNgayKetThuc = (ngay_ket_thuc && ngay_ket_thuc.trim() !== '') ? ngay_ket_thuc : null;

    // Thêm hợp đồng vào database
    const [result] = await db.query(`
      INSERT INTO HOPDONG (ma_nv, loai_hop_dong, ngay_bat_dau, ngay_ket_thuc, file_hop_dong)
      VALUES (?, ?, ?, ?, ?)
    `, [ma_nv, loai_hop_dong, ngay_bat_dau, finalNgayKetThuc, file_hop_dong]);

    console.log('Contract created successfully, ID:', result.insertId);

    res.status(201).json({ 
      success: true,
      message: 'Thêm hợp đồng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Lấy danh sách hợp đồng =================
exports.getContracts = async (req, res) => {
  try {
    const { ma_nv, loai_hop_dong, ma_phong } = req.query;

    let query = `
      SELECT 
        hd.*,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        CASE
          WHEN hd.ngay_ket_thuc IS NULL THEN 'Vô thời hạn'
          WHEN hd.ngay_ket_thuc < CURDATE() THEN 'Hết hạn'
          WHEN DATEDIFF(hd.ngay_ket_thuc, CURDATE()) <= 30 THEN 'Sắp hết hạn'
          ELSE 'Còn hiệu lực'
        END as trang_thai,
        DATEDIFF(hd.ngay_ket_thuc, CURDATE()) as con_lai_ngay
      FROM HOPDONG hd
      JOIN NHANVIEN nv ON hd.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE 1=1
    `;
    const params = [];

    if (ma_nv) {
      query += ' AND hd.ma_nv = ?';
      params.push(ma_nv);
    }

    if (loai_hop_dong) {
      query += ' AND hd.loai_hop_dong = ?';
      params.push(loai_hop_dong);
    }

    if (ma_phong) {
      query += ' AND nv.ma_phong = ?';
      params.push(ma_phong);
    }

    query += ' ORDER BY hd.ngay_bat_dau DESC';

    const [contracts] = await db.query(query, params);

    res.json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    console.error('Get contracts error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Lấy chi tiết hợp đồng =================
exports.getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const [contracts] = await db.query(`
      SELECT 
        hd.*,
        nv.ten_nv,
        nv.ngay_sinh,
        nv.gioi_tinh,
        pb.ten_phong,
        cv.ten_chuc_vu,
        CASE
          WHEN hd.ngay_ket_thuc IS NULL THEN 'Vô thời hạn'
          WHEN hd.ngay_ket_thuc < CURDATE() THEN 'Hết hạn'
          WHEN DATEDIFF(hd.ngay_ket_thuc, CURDATE()) <= 30 THEN 'Sắp hết hạn'
          ELSE 'Còn hiệu lực'
        END as trang_thai,
        DATEDIFF(hd.ngay_ket_thuc, CURDATE()) as con_lai_ngay
      FROM HOPDONG hd
      JOIN NHANVIEN nv ON hd.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE hd.id = ?
    `, [id]);

    if (contracts.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy hợp đồng' 
      });
    }

    res.json({
      success: true,
      data: contracts[0]
    });
  } catch (error) {
    console.error('Get contract by id error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Hợp đồng sắp hết hạn =================
exports.getExpiringContracts = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const [contracts] = await db.query(`
      SELECT 
        hd.*,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        DATEDIFF(hd.ngay_ket_thuc, CURDATE()) as con_lai_ngay
      FROM HOPDONG hd
      JOIN NHANVIEN nv ON hd.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE hd.ngay_ket_thuc IS NOT NULL
        AND hd.ngay_ket_thuc BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND nv.trang_thai = 1
      ORDER BY hd.ngay_ket_thuc ASC
    `, [parseInt(days)]);

    res.json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    console.error('Get expiring contracts error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Hợp đồng đã hết hạn =================
exports.getExpiredContracts = async (req, res) => {
  try {
    const [contracts] = await db.query(`
      SELECT 
        hd.*,
        nv.ten_nv,
        pb.ten_phong,
        cv.ten_chuc_vu,
        DATEDIFF(CURDATE(), hd.ngay_ket_thuc) as qua_han_ngay
      FROM HOPDONG hd
      JOIN NHANVIEN nv ON hd.ma_nv = nv.ma_nv
      JOIN PHONGBAN pb ON nv.ma_phong = pb.ma_phong
      JOIN CHUCVU cv ON nv.ma_chucvu = cv.ma_chuc_vu
      WHERE hd.ngay_ket_thuc < CURDATE()
        AND nv.trang_thai = 1
        AND NOT EXISTS (
          SELECT 1 FROM HOPDONG hd2 
          WHERE hd2.ma_nv = hd.ma_nv 
          AND hd2.ngay_bat_dau > hd.ngay_ket_thuc
        )
      ORDER BY qua_han_ngay DESC
    `);

    res.json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    console.error('Get expired contracts error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Thống kê hợp đồng theo loại =================
exports.getContractStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        hd.loai_hop_dong,
        COUNT(*) as so_luong,
        COUNT(CASE WHEN hd.ngay_ket_thuc IS NULL OR hd.ngay_ket_thuc >= CURDATE() THEN 1 END) as con_hieu_luc,
        COUNT(CASE WHEN hd.ngay_ket_thuc < CURDATE() THEN 1 END) as da_het_han
      FROM HOPDONG hd
      JOIN NHANVIEN nv ON hd.ma_nv = nv.ma_nv
      WHERE nv.trang_thai = 1
      GROUP BY hd.loai_hop_dong
    `);

    // Tổng hợp
    const total = stats.reduce((sum, item) => sum + item.so_luong, 0);
    const totalActive = stats.reduce((sum, item) => sum + item.con_hieu_luc, 0);
    const totalExpired = stats.reduce((sum, item) => sum + item.da_het_han, 0);

    res.json({
      success: true,
      total: {
        so_luong: total,
        con_hieu_luc: totalActive,
        da_het_han: totalExpired
      },
      byType: stats
    });
  } catch (error) {
    console.error('Get contract stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Cập nhật hợp đồng =================
exports.updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('===== UPDATE CONTRACT DEBUG =====');
    console.log('Contract ID:', id);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('================================');

    // Nếu có upload file mới thì lưu filename
    if (req.file) {
      updates.file_hop_dong = req.file.filename;
    }

    // Kiểm tra hợp đồng tồn tại
    const [existing] = await db.query(
      'SELECT * FROM HOPDONG WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy hợp đồng' 
      });
    }

    // Không cho phép cập nhật ma_nv và id
    delete updates.ma_nv;
    delete updates.id;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Không có thông tin cần cập nhật' 
      });
    }

    // Kiểm tra ngày hợp lệ
    if (updates.ngay_ket_thuc && updates.ngay_bat_dau) {
      if (new Date(updates.ngay_ket_thuc) < new Date(updates.ngay_bat_dau)) {
        return res.status(400).json({ 
          success: false,
          message: 'Ngày kết thúc phải sau ngày bắt đầu' 
        });
      }
    }

    // Xử lý ngay_ket_thuc rỗng
    if (updates.ngay_ket_thuc === '' || updates.ngay_ket_thuc === undefined) {
      updates.ngay_ket_thuc = null;
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await db.query(`UPDATE HOPDONG SET ${fields} WHERE id = ?`, values);

    console.log('Contract updated successfully');

    res.json({ 
      success: true,
      message: 'Cập nhật hợp đồng thành công' 
    });
  } catch (error) {
    console.error('Update contract error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ================= Xóa hợp đồng =================
exports.deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM HOPDONG WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy hợp đồng' 
      });
    }

    res.json({ 
      success: true,
      message: 'Xóa hợp đồng thành công' 
    });
  } catch (error) {
    console.error('Delete contract error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};