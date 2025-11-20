/**
 * Helper functions cho xử lý ngày tháng
 */

/**
 * Format date thành YYYY-MM-DD
 */
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Format datetime thành YYYY-MM-DD HH:mm:ss
 */
function formatDateTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format time thành HH:mm:ss
 */
function formatTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Lấy ngày hôm nay (YYYY-MM-DD)
 */
function getToday() {
  return formatDate(new Date());
}

/**
 * Lấy tháng hiện tại
 */
function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

/**
 * Lấy năm hiện tại
 */
function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Tính số ngày giữa 2 ngày
 */
function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Tính tuổi từ ngày sinh
 */
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Tính số năm công tác
 */
function calculateWorkYears(startDate) {
  return calculateAge(startDate);
}

/**
 * Kiểm tra có phải cuối tuần không
 */
function isWeekend(date) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Lấy ngày đầu tháng
 */
function getFirstDayOfMonth(year, month) {
  return formatDate(new Date(year, month - 1, 1));
}

/**
 * Lấy ngày cuối tháng
 */
function getLastDayOfMonth(year, month) {
  return formatDate(new Date(year, month, 0));
}

/**
 * Lấy số ngày trong tháng
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Thêm ngày vào date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
}

/**
 * Trừ ngày từ date
 */
function subtractDays(date, days) {
  return addDays(date, -days);
}

/**
 * Thêm tháng vào date
 */
function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return formatDate(result);
}

/**
 * Format ngày theo định dạng Việt Nam (dd/mm/yyyy)
 */
function formatDateVN(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Kiểm tra ngày có hợp lệ không
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * So sánh 2 ngày
 * @returns {number} - -1 nếu date1 < date2, 0 nếu bằng, 1 nếu date1 > date2
 */
function compareDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Lấy tên tháng tiếng Việt
 */
function getMonthNameVN(month) {
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  return months[month - 1];
}

/**
 * Lấy tên thứ tiếng Việt
 */
function getDayNameVN(date) {
  const d = new Date(date);
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[d.getDay()];
}

module.exports = {
  formatDate,
  formatDateTime,
  formatTime,
  getToday,
  getCurrentMonth,
  getCurrentYear,
  daysBetween,
  calculateAge,
  calculateWorkYears,
  isWeekend,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getDaysInMonth,
  addDays,
  subtractDays,
  addMonths,
  formatDateVN,
  isValidDate,
  compareDates,
  getMonthNameVN,
  getDayNameVN
};