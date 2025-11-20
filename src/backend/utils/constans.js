/**
 * Constants được sử dụng trong hệ thống
 */

// Vai trò người dùng
const USER_ROLES = {
  ADMIN: 'Admin',
  EMPLOYEE: 'NhanVien',
  ACCOUNTANT: 'KeToan'
};

// Giới tính
const GENDERS = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác'
};

// Trạng thái nhân viên
const EMPLOYEE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};

// Trạng thái phòng ban
const DEPARTMENT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};

// Trạng thái yêu cầu nghỉ phép
const LEAVE_STATUS = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối'
};

// Loại nghỉ phép
const LEAVE_TYPES = {
  ANNUAL: 'Nghỉ phép năm',
  SICK: 'Nghỉ ốm',
  PERSONAL: 'Nghỉ việc riêng',
  UNPAID: 'Nghỉ không lương',
  MATERNITY: 'Nghỉ thai sản',
  PATERNITY: 'Nghỉ chăm con',
  MARRIAGE: 'Nghỉ cưới',
  FUNERAL: 'Nghỉ tang'
};

// Loại hợp đồng
const CONTRACT_TYPES = {
  PROBATION: 'Thử việc',
  FIXED_TERM: 'Có thời hạn',
  INDEFINITE: 'Vô thời hạn',
  SEASONAL: 'Thời vụ',
  PROJECT: 'Theo dự án'
};

// Số giờ làm việc
const WORKING_HOURS = {
  STANDARD_WEEKLY: 40,       // Số giờ chuẩn/tuần
  STANDARD_MONTHLY: 160,     // Số giờ chuẩn/tháng (20 ngày x 8 giờ)
  STANDARD_DAILY: 8,         // Số giờ chuẩn/ngày
  OVERTIME_MULTIPLIER: 1.5   // Hệ số lương làm thêm giờ
};

// Thời gian làm việc
const WORK_TIME = {
  START: '08:00:00',         // Giờ vào chuẩn
  END: '17:00:00',           // Giờ ra chuẩn
  LATE_THRESHOLD: '08:15:00' // Ngưỡng đi muộn
};

// Tuổi
const AGE = {
  MIN_WORKING: 18,           // Tuổi tối thiểu làm việc
  RETIREMENT_MALE: 60,       // Tuổi nghỉ hưu nam
  RETIREMENT_FEMALE: 55      // Tuổi nghỉ hưu nữ
};

// Số ngày nghỉ phép
const ANNUAL_LEAVE_DAYS = {
  STANDARD: 12,              // Số ngày phép năm chuẩn
  ADDITIONAL_PER_5_YEARS: 1  // Thêm 1 ngày/5 năm công tác
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Không có quyền truy cập',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  SERVER_ERROR: 'Lỗi server',
  DUPLICATE: 'Dữ liệu đã tồn tại',
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  TOKEN_INVALID: 'Token không hợp lệ'
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN: 'Đăng nhập thành công',
  LOGOUT: 'Đăng xuất thành công',
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  RESTORED: 'Khôi phục thành công',
  APPROVED: 'Duyệt thành công',
  REJECTED: 'Từ chối thành công'
};

// Date Formats
const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  DATE_VN: 'DD/MM/YYYY'
};

// File Upload
const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,     // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  UPLOAD_PATH: 'uploads/'
};

// Regex Patterns
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_VN: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
  USERNAME: /^[a-zA-Z0-9_]{4,50}$/,
  PASSWORD: /^.{6,}$/
};

// Environment
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  VERY_LONG: 86400  // 1 day
};

// Export all constants
module.exports = {
  USER_ROLES,
  GENDERS,
  EMPLOYEE_STATUS,
  DEPARTMENT_STATUS,
  LEAVE_STATUS,
  LEAVE_TYPES,
  CONTRACT_TYPES,
  WORKING_HOURS,
  WORK_TIME,
  AGE,
  ANNUAL_LEAVE_DAYS,
  PAGINATION,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  FILE_UPLOAD,
  REGEX,
  ENVIRONMENTS,
  CACHE_TTL
};