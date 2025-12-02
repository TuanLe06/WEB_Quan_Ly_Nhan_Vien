
/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnam)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate national ID (CMND/CCCD - Vietnam)
 */
export const isValidNationalId = (id: string): boolean => {
  const nationalIdRegex = /^[0-9]{9}$|^[0-9]{12}$/;
  return nationalIdRegex.test(id);
};

/**
 * Validate password
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate min length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validate max length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validate number range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate date range
 */
export const isDateInRange = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
};

/**
 * Get validation error message
 */
export const getValidationError = (field: string, rule: string): string => {
  const errors: Record<string, Record<string, string>> = {
    email: {
      required: 'Email là bắt buộc',
      invalid: 'Email không hợp lệ',
    },
    phone: {
      required: 'Số điện thoại là bắt buộc',
      invalid: 'Số điện thoại không hợp lệ',
    },
    password: {
      required: 'Mật khẩu là bắt buộc',
      invalid: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
      minLength: 'Mật khẩu phải có ít nhất 8 ký tự',
    },
    nationalId: {
      required: 'CMND/CCCD là bắt buộc',
      invalid: 'CMND/CCCD không hợp lệ (9 hoặc 12 số)',
    },
  };
  
  return errors[field]?.[rule] || `${field} không hợp lệ`;
};