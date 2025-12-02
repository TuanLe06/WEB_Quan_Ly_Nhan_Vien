import axios from './axiosConfig';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authApi = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Đăng ký (Admin only)
  register: async (userData: any): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword: string, newPassword: string): Promise<AuthResponse> => {
    const response = await axios.put<AuthResponse>('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getMe: async (): Promise<User> => {
    const response = await axios.get<{ user: User }>('/auth/me');
    return response.data.user;
  }
};