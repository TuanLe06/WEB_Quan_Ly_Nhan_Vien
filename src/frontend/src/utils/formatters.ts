import { format, parseISO, addHours } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Convert UTC date to Vietnam timezone (UTC+7)
 */
const toVietnamTime = (date: string | Date): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  // Add 7 hours to convert UTC to Vietnam time
  return addHours(dateObj, 7);
};

/**
 * Format currency (VND)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format number with thousand separator
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format date (converts UTC to Vietnam time)
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const vnDate = toVietnamTime(date);
    return format(vnDate, formatStr, { locale: vi });
  } catch (error) {
    return '';
  }
};

/**
 * Format date time (converts UTC to Vietnam time)
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format time - handles both Date objects and time strings (HH:mm:ss)
 */
export const formatTime = (time: string | Date): string => {
  if (!time) return '--:--';
  
  try {
    // If it's a time string (HH:mm:ss or HH:mm)
    if (typeof time === 'string') {
      const parts = time.split(':');
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }
    
    // If it's a Date object
    return formatDate(time, 'HH:mm');
  } catch (error) {
    return '--:--';
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as: 0xxx xxx xxx
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

/**
 * Format employee code
 */
export const formatEmployeeCode = (code: string): string => {
  return code.toUpperCase();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get initials from full name
 */
export const getInitials = (fullName: string): string => {
  const words = fullName.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert status to Vietnamese
 */
export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    ON_LEAVE: 'Đang nghỉ',
    TERMINATED: 'Đã nghỉ việc',
    PRESENT: 'Có mặt',
    ABSENT: 'Vắng mặt',
    LATE: 'Đi muộn',
    EARLY_LEAVE: 'Về sớm',
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    CANCELLED: 'Đã hủy',
    PAID: 'Đã thanh toán',
    DRAFT: 'Nháp',
    EXPIRED: 'Hết hạn',
  };
  
  return statusMap[status] || status;
};

/**
 * Convert gender to Vietnamese
 */
export const getGenderText = (gender: string): string => {
  const genderMap: Record<string, string> = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
  };
  
  return genderMap[gender] || gender;
};

/**
 * Convert leave type to Vietnamese
 */
export const getLeaveTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    ANNUAL: 'Nghỉ phép năm',
    SICK: 'Nghỉ ốm',
    MATERNITY: 'Nghỉ thai sản',
    UNPAID: 'Nghỉ không lương',
    OTHER: 'Khác',
  };
  
  return typeMap[type] || type;
};

/**
 * Convert contract type to Vietnamese
 */
export const getContractTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    FULL_TIME: 'Toàn thời gian',
    PART_TIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    INTERNSHIP: 'Thực tập',
  };
  
  return typeMap[type] || type;
};