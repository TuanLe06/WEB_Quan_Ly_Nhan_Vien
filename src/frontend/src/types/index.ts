// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  // Extra fields cho calculate API
  needConfirm?: boolean;
  locked?: boolean;
  confirmed?: boolean;
  forced?: boolean;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: PaginationData;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// AUTH TYPES
// ============================================
export interface User {
  username: string;
  vai_tro: 'Admin' | 'NhanVien' | 'KeToan';
  ma_nv: string | null;
  ten_nv?: string;
  ma_phong?: string;
  ten_phong?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// ============================================
// EMPLOYEE TYPES
// ============================================
export interface Employee {
  ma_nv: string;
  ten_nv: string;
  ngay_sinh: string;
  gioi_tinh: string;
  ma_phong: string;
  ten_phong?: string;
  ma_chucvu: string;
  ten_chuc_vu?: string;
  luong_co_ban: number;
  ngay_vao_lam: string;
  trang_thai: number;
  tuoi?: number;
  nam_cong_tac?: number;
}

export interface EmployeeFormData {
  ten_nv: string;
  ngay_sinh: string;
  gioi_tinh: string;
  ma_phong: string;
  ma_chucvu: string;
  luong_co_ban: number;
  ngay_vao_lam: string;
}

// ============================================
// DEPARTMENT TYPES
// ============================================
export interface Department {
  ma_phong: string;
  ten_phong: string;
  nam_thanh_lap: number;
  trang_thai: number;
  so_nhan_vien?: number;
}

// ============================================
// POSITION TYPES
// ============================================
export interface Position {
  ma_chuc_vu: string;
  ten_chuc_vu: string;
  so_nhan_vien?: number;
}

// ============================================
// ATTENDANCE TYPES
// ============================================
export interface Attendance {
  id: number;
  ma_nv: string;
  ten_nv?: string;
  ngay_lam: string;
  gio_vao: string;
  gio_ra: string | null;
  so_gio: number;
  trang_thai?: string;
}

export interface AttendanceStats {
  ma_nv: string;
  ten_nv: string;
  ten_phong: string;
  ten_chuc_vu: string;
  so_ngay_lam: number;
  tong_gio: number;
  gio_tb_ngay: number;
  danh_gia: string;
}

// ============================================
// SALARY TYPES (FIXED - KHỚP VỚI BE & DB)
// ============================================
export interface Salary {
  id: number;
  ma_nv: string;
  ten_nv?: string;
  ten_phong?: string;
  ten_chuc_vu?: string;

  thang: number;
  nam: number;
  tong_gio: number;

  // ✅ FIX: Khớp với DB schema - có cả 2 field
  luong_co_ban?: number; // Từ JOIN NHANVIEN (lương hiện tại)
  luong_co_ban_thoi_diem?: number; // Snapshot trong LUONG table

  luong_them: number;
  tru_luong: number; // ✅ Changed: Không optional, default 0
  luong_thuc_nhan: number;

  ngay_tinh: string;

  // ✅ FIX: Trạng thái khớp với DB ENUM và BE response
  trang_thai?: 'Bản nháp' | 'Đã xác nhận' | 'Đã khóa';
  nguoi_chot?: string;
  ngay_chot?: string;
  ghi_chu?: string;
}

// Deducted salary (lương bị trừ giờ)
export interface DeductedSalary extends Salary {
  gio_thieu?: number;
}

// Response thu thập dữ liệu lương theo tháng
export interface SalaryMonthlyResponse {
  success: boolean;
  count: number;
  tongLuong: number;
  tongTruLuong: number;
  soNVBiTru: number;

  // ✅ FIX: Khớp với BE response
  statusCount?: {
    'Bản nháp': number;
    'Đã xác nhận': number;
    'Đã khóa': number;
  };

  data: Salary[];
}

// ============================================
// LEAVE TYPES
// ============================================
export interface Leave {
  id: number;
  ma_nv: string;
  ten_nv?: string;
  ten_phong?: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  loai_phep: string;
  ly_do: string;
  trang_thai: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  ngay_tao: string;
  so_ngay?: number;
}

export interface LeaveFormData {
  ma_nv: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  loai_phep: string;
  ly_do: string;
}

// ============================================
// CONTRACT TYPES
// ============================================
export interface Contract {
  id: number;
  ma_nv: string;
  ten_nv?: string;
  ten_phong?: string;
  loai_hop_dong: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string | null;
  file_hop_dong: string | null;
  ngay_tao: string;
  trang_thai?: string;
  con_lai_ngay?: number;
}

// ============================================
// DASHBOARD TYPES
// ============================================
export interface DashboardStats {
  tongNhanVien: number;
  tongPhongBan: number;
  daChamCong: number;
  yeuCauNghiPhep: number;
  tongLuongThang: number;
  hopDongSapHetHan: number;
  nhanVienMoi: number;
  nghiPhepHomNay: number;
}

export interface EmployeesByDepartment {
  ma_phong: string;
  ten_phong: string;
  so_luong: number;
  nam: number;
  nu: number;
}

export interface SalaryTrend {
  thang: number;
  nam: number;
  so_nhan_vien: number;
  tong_luong: number;
  luong_tb: number;
}