/**
 * Validation functions cho các trường dữ liệu
 */

/**
 * Validate email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate số điện thoại Việt Nam
 */
function isValidPhoneNumber(phone) {
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate ngày tháng (YYYY-MM-DD)
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate mã phòng ban (3 ký tự)
 */
function isValidDepartmentCode(code) {
  return typeof code === 'string' && code.length === 3 && /^[A-Z]{3}$/.test(code);
}

/**
 * Validate mã chức vụ (1 ký tự)
 */
function isValidPositionCode(code) {
  return typeof code === 'string' && code.length === 1 && /^[A-Z]$/.test(code);
}

/**
 * Validate username (4-50 ký tự, chỉ chữ, số và _)
 */
function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{4,50}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password (tối thiểu 6 ký tự)
 */
function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

/**
 * Validate vai trò
 */
function isValidRole(role) {
  const validRoles = ['Admin', 'NhanVien', 'KeToan'];
  return validRoles.includes(role);
}

/**
 * Validate giới tính
 */
function isValidGender(gender) {
  const validGenders = ['Nam', 'Nữ', 'Khác'];
  return validGenders.includes(gender);
}

/**
 * Validate số tiền (phải > 0)
 */
function isValidAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

/**
 * Validate tháng (1-12)
 */
function isValidMonth(month) {
  const num = parseInt(month);
  return !isNaN(num) && num >= 1 && num <= 12;
}

/**
 * Validate năm (>= 2000)
 */
function isValidYear(year) {
  const num = parseInt(year);
  return !isNaN(num) && num >= 2000 && num <= new Date().getFullYear() + 1;
}

/**
 * Validate ngày sinh (phải >= 18 tuổi)
 */
function isValidBirthDate(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  
  if (isNaN(birth)) return false;
  
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
}

/**
 * Validate khoảng thời gian (ngày kết thúc >= ngày bắt đầu)
 */
function isValidDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start) || isNaN(end)) return false;
  
  return end >= start;
}

/**
 * Validate số giờ làm việc (0-24)
 */
function isValidWorkingHours(hours) {
  const num = parseFloat(hours);
  return !isNaN(num) && num >= 0 && num <= 24;
}

/**
 * Sanitize string (xóa ký tự đặc biệt nguy hiểm)
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Validate request body có đầy đủ các trường bắt buộc không
 */
function hasRequiredFields(obj, requiredFields) {
  return requiredFields.every(field => {
    return obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined && obj[field] !== '';
  });
}

/**
 * Tạo error message từ validation errors
 */
function formatValidationErrors(errors) {
  return errors.map(err => err.message || err).join(', ');
}

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  isValidDate,
  isValidDepartmentCode,
  isValidPositionCode,
  isValidUsername,
  isValidPassword,
  isValidRole,
  isValidGender,
  isValidAmount,
  isValidMonth,
  isValidYear,
  isValidBirthDate,
  isValidDateRange,
  isValidWorkingHours,
  sanitizeString,
  hasRequiredFields,
  formatValidationErrors
};