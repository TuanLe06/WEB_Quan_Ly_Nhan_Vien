import axios from './axiosConfig';
import { Department, ApiResponse } from '../types';

export const departmentApi = {
  // Lấy danh sách phòng ban
  getAll: async (params?: { trang_thai?: number }): Promise<Department[]> => {
    const response = await axios.get<ApiResponse<Department[]>>('/departments', { params });
    return response.data.data || [];
  },

  // Lấy thông tin chi tiết phòng ban
  getById: async (id: string): Promise<Department> => {
    const response = await axios.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data.data!;
  },

  // Thêm phòng ban mới
  create: async (data: Omit<Department, 'so_nhan_vien'>): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/departments', data);
    return response.data;
  },

  // Cập nhật phòng ban
  update: async (id: string, data: Partial<Department>): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/departments/${id}`, data);
    return response.data;
  },

  // Xóa phòng ban
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/departments/${id}`);
    return response.data;
  }
};