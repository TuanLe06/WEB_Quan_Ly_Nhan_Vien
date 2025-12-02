import axios from './axiosConfig';
import { Employee, EmployeeFormData, ApiResponse } from '../types';

export const employeeApi = {
  // Lấy danh sách nhân viên
  getAll: async (params?: {
    trang_thai?: number;
    ma_phong?: string;
    keyword?: string;
  }): Promise<Employee[]> => {
    const response = await axios.get<ApiResponse<Employee[]>>('/employees', { params });
    return response.data.data || [];
  },

  // Lấy thông tin chi tiết nhân viên
  getById: async (id: string): Promise<Employee> => {
    const response = await axios.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data!;
  },

  // Thêm nhân viên mới
  create: async (data: EmployeeFormData): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/employees', data);
    return response.data;
  },

  // Cập nhật nhân viên
  update: async (id: string, data: Partial<EmployeeFormData>): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/employees/${id}`, data);
    return response.data;
  },

  // Xóa nhân viên (soft delete)
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/employees/${id}`);
    return response.data;
  },

  // Khôi phục nhân viên
  restore: async (id: string): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/employees/${id}/restore`);
    return response.data;
  },

  // Thống kê nhân viên
  getStats: async (): Promise<any> => {
    const response = await axios.get<ApiResponse>('/employees/stats');
    return response.data.data;
  }
};