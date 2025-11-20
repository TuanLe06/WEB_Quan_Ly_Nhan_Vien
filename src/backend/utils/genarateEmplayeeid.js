const db = require('../config/database');

/**
 * Sinh mã nhân viên tự động theo format: <Mã phòng><Mã chức vụ><STT 4 số>
 * Ví dụ: PDAT0001, PKTN0002
 * 
 * @param {string} ma_phong - Mã phòng ban (3 ký tự)
 * @param {string} ma_chucvu - Mã chức vụ (1 ký tự)
 * @returns {Promise<string>} - Mã nhân viên mới
 */
async function generateEmployeeId(ma_phong, ma_chucvu) {
  try {
    // Đếm số nhân viên hiện có với cùng phòng ban và chức vụ
    const [result] = await db.query(`
      SELECT COUNT(*) as count 
      FROM NHANVIEN 
      WHERE ma_phong = ? AND ma_chucvu = ?
    `, [ma_phong, ma_chucvu]);

    // Số thứ tự tiếp theo
    const nextNumber = result[0].count + 1;

    // Format số thành 4 chữ số (0001, 0002, ...)
    const formattedNumber = String(nextNumber).padStart(4, '0');

    // Tạo mã nhân viên
    const employeeId = `${ma_phong}${ma_chucvu}${formattedNumber}`;

    return employeeId;
  } catch (error) {
    throw new Error('Không thể sinh mã nhân viên: ' + error.message);
  }
}

/**
 * Kiểm tra mã nhân viên có tồn tại không
 * 
 * @param {string} ma_nv - Mã nhân viên cần kiểm tra
 * @returns {Promise<boolean>} - true nếu tồn tại, false nếu không
 */
async function checkEmployeeIdExists(ma_nv) {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM NHANVIEN WHERE ma_nv = ?',
      [ma_nv]
    );
    return result[0].count > 0;
  } catch (error) {
    throw new Error('Không thể kiểm tra mã nhân viên: ' + error.message);
  }
}

/**
 * Parse mã nhân viên để lấy thông tin phòng ban và chức vụ
 * 
 * @param {string} ma_nv - Mã nhân viên (VD: PDAT0001)
 * @returns {Object} - {ma_phong, ma_chucvu, stt}
 */
function parseEmployeeId(ma_nv) {
  if (!ma_nv || ma_nv.length < 5) {
    throw new Error('Mã nhân viên không hợp lệ');
  }

  return {
    ma_phong: ma_nv.substring(0, 3),      // 3 ký tự đầu
    ma_chucvu: ma_nv.substring(3, 4),     // Ký tự thứ 4
    stt: ma_nv.substring(4)               // Phần còn lại
  };
}

module.exports = {
  generateEmployeeId,
  checkEmployeeIdExists,
  parseEmployeeId
};