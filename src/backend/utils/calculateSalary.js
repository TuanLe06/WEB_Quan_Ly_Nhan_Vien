/**
 * Tính lương theo công thức:
 * - Nếu làm <= 40 giờ/tháng: Lương = Lương cơ bản
 * - Nếu làm > 40 giờ/tháng: Lương = Lương cơ bản + (Giờ làm thêm x (Lương cơ bản / 40) x 1.5)
 * 
 * @param {number} luong_co_ban - Lương cơ bản
 * @param {number} tong_gio - Tổng số giờ làm trong tháng
 * @returns {Object} - {luong_them, luong_thuc_nhan}
 */
function calculateSalary(luong_co_ban, tong_gio) {
  const GIO_CHUAN = 40; // Số giờ chuẩn
  const HE_SO_LUONG_THEM = 1.5; // Hệ số lương làm thêm giờ

  let luong_them = 0;
  let luong_thuc_nhan = 0;

  if (tong_gio <= GIO_CHUAN) {
    // Không có lương thêm
    luong_thuc_nhan = luong_co_ban;
  } else {
    // Có lương thêm giờ
    const gio_lam_them = tong_gio - GIO_CHUAN;
    const don_gia_gio = luong_co_ban / GIO_CHUAN;
    luong_them = gio_lam_them * don_gia_gio * HE_SO_LUONG_THEM;
    luong_thuc_nhan = luong_co_ban + luong_them;
  }

  return {
    luong_them: Math.round(luong_them),
    luong_thuc_nhan: Math.round(luong_thuc_nhan)
  };
}

/**
 * Tính số giờ làm việc giữa 2 thời điểm
 * 
 * @param {string} gio_vao - Giờ vào (HH:mm:ss)
 * @param {string} gio_ra - Giờ ra (HH:mm:ss)
 * @returns {number} - Số giờ làm việc
 */
function calculateWorkingHours(gio_vao, gio_ra) {
  if (!gio_vao || !gio_ra) {
    return 0;
  }

  const [hoursIn, minutesIn, secondsIn] = gio_vao.split(':').map(Number);
  const [hoursOut, minutesOut, secondsOut] = gio_ra.split(':').map(Number);

  const timeIn = hoursIn * 60 + minutesIn + secondsIn / 60;
  const timeOut = hoursOut * 60 + minutesOut + secondsOut / 60;

  const workingMinutes = timeOut - timeIn;
  const workingHours = workingMinutes / 60;

  return Math.max(0, Math.round(workingHours * 100) / 100); // Làm tròn 2 chữ số
}

/**
 * Kiểm tra đủ giờ làm trong tháng chưa (160 giờ = 20 ngày x 8 giờ)
 * 
 * @param {number} tong_gio - Tổng số giờ làm
 * @returns {boolean} - true nếu đủ giờ
 */
function isEnoughWorkingHours(tong_gio) {
  const GIO_CHUAN_THANG = 160; // 20 ngày x 8 giờ
  return tong_gio >= GIO_CHUAN_THANG;
}

/**
 * Tính phần trăm hoàn thành công việc trong tháng
 * 
 * @param {number} tong_gio - Tổng số giờ làm
 * @returns {number} - Phần trăm (0-100)
 */
function calculateCompletionPercentage(tong_gio) {
  const GIO_CHUAN_THANG = 160;
  const percentage = (tong_gio / GIO_CHUAN_THANG) * 100;
  return Math.min(100, Math.round(percentage)); // Tối đa 100%
}

/**
 * Format số tiền VNĐ
 * 
 * @param {number} amount - Số tiền
 * @returns {string} - Số tiền đã format
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

/**
 * Tính tổng lương của nhiều nhân viên
 * 
 * @param {Array} salaries - Mảng các object {luong_thuc_nhan}
 * @returns {number} - Tổng lương
 */
function calculateTotalSalary(salaries) {
  return salaries.reduce((total, item) => {
    return total + (parseFloat(item.luong_thuc_nhan) || 0);
  }, 0);
}

/**
 * Tính lương trung bình
 * 
 * @param {Array} salaries - Mảng các object {luong_thuc_nhan}
 * @returns {number} - Lương trung bình
 */
function calculateAverageSalary(salaries) {
  if (salaries.length === 0) return 0;
  const total = calculateTotalSalary(salaries);
  return Math.round(total / salaries.length);
}

module.exports = {
  calculateSalary,
  calculateWorkingHours,
  isEnoughWorkingHours,
  calculateCompletionPercentage,
  formatCurrency,
  calculateTotalSalary,
  calculateAverageSalary
};