import axios from './axiosConfig';
import { Leave, LeaveFormData, ApiResponse } from '../types';

export const leaveApi = {
  // Gửi yêu cầu nghỉ phép
  create: async (data: LeaveFormData): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/leave', data);
    return response.data;
  },

  // Lấy danh sách yêu cầu nghỉ phép
  getAll: async (params?: {
    trang_thai?: string;
    ma_nv?: string;
    ma_phong?: string;
  }): Promise<Leave[]> => {
    const response = await axios.get<ApiResponse<Leave[]>>('/leave', { params });
    return response.data.data || [];
  },

  // Lấy chi tiết yêu cầu nghỉ phép
  getById: async (id: number): Promise<Leave> => {
    const response = await axios.get<ApiResponse<Leave>>(`/leave/${id}`);
    return response.data.data!;
  },

  // Ai đang nghỉ phép hôm nay
  getToday: async (): Promise<Leave[]> => {
    const response = await axios.get<ApiResponse<Leave[]>>('/leave/today');
    return response.data.data || [];
  },

  // Thống kê nghỉ phép
  getStats: async (nam: number): Promise<any[]> => {
    const response = await axios.get<ApiResponse>('/leave/stats', {
      params: { nam }
    });
    return response.data.data || [];
  },

  // Duyệt/Từ chối yêu cầu
  updateStatus: async (id: number, trang_thai: string, ghi_chu?: string): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/leave/${id}/status`, {
      trang_thai,
      ghi_chu
    });
    return response.data;
  },

  // Cập nhật yêu cầu nghỉ phép (trước khi duyệt)
  update: async (id: number, data: Partial<LeaveFormData>): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/leave/${id}`, data);
    return response.data;
  },

  // Xóa yêu cầu nghỉ phép
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/leave/${id}`);
    return response.data;
  }
};