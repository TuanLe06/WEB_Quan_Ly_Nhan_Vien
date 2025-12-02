import axios from './axiosConfig';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authApi = {
  // POST /api/auth/login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  // POST /api/auth/register (Admin only)
  register: async (userData: any): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  // GET /api/auth/me
  getCurrentUser: async (): Promise<User> => {
    const { data } = await axios.get<{ success: boolean; user: User }>('/auth/me');
    return data.user;
  },

  // PUT /api/auth/change-password
  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const { data } = await axios.put('/auth/change-password', passwords);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};