import axios from './axiosConfig';
import { Salary, ApiResponse } from '../types';

export const salaryApi = {
  // Tính lương cho một nhân viên
  calculate: async (ma_nv: string, thang: number, nam: number): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/salary/calculate', { ma_nv, thang, nam });
    return response.data;
  },

  // Tính lương cho tất cả nhân viên
  calculateAll: async (thang: number, nam: number): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/salary/calculate-all', { thang, nam });
    return response.data;
  },

  // Xem bảng lương tháng
  getMonthly: async (thang: number, nam: number, ma_phong?: string): Promise<Salary[]> => {
    const response = await axios.get<ApiResponse<Salary[]>>('/salary/monthly', {
      params: { thang, nam, ma_phong }
    });
    return response.data.data || [];
  },

  // Xem chi tiết lương của nhân viên
  getByEmployee: async (ma_nv: string, params?: { thang?: number; nam?: number }): Promise<Salary[]> => {
    const response = await axios.get<ApiResponse<Salary[]>>(`/salary/employee/${ma_nv}`, { params });
    return response.data.data || [];
  },

  // Top nhân viên lương cao nhất
  getTop: async (thang: number, nam: number, limit: number = 10): Promise<Salary[]> => {
    const response = await axios.get<ApiResponse<Salary[]>>('/salary/top', {
      params: { thang, nam, limit }
    });
    return response.data.data || [];
  },

  // Tổng quỹ lương theo phòng ban
  getByDepartment: async (thang: number, nam: number): Promise<any[]> => {
    const response = await axios.get<ApiResponse>('/salary/by-department', {
      params: { thang, nam }
    });
    return response.data.data || [];
  },

  // So sánh lương theo tháng
  compare: async (nam: number, soThang: number = 6): Promise<any[]> => {
    const response = await axios.get<ApiResponse>('/salary/compare', {
      params: { nam, soThang }
    });
    return response.data.data || [];
  },

  // Xóa bảng lương (Admin)
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/salary/${id}`);
    return response.data;
  }
};