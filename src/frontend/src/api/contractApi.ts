import axios from './axiosConfig';
import { Contract, ApiResponse } from '../types';

export const contractApi = {
  // Thêm hợp đồng mới
  create: async (data: Omit<Contract, 'id' | 'ngay_tao' | 'trang_thai' | 'con_lai_ngay'>): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/contracts', data);
    return response.data;
  },

  // Lấy danh sách hợp đồng
  getAll: async (params?: {
    ma_nv?: string;
    loai_hop_dong?: string;
    ma_phong?: string;
  }): Promise<Contract[]> => {
    const response = await axios.get<ApiResponse<Contract[]>>('/contracts', { params });
    return response.data.data || [];
  },

  // Lấy chi tiết hợp đồng
  getById: async (id: number): Promise<Contract> => {
    const response = await axios.get<ApiResponse<Contract>>(`/contracts/${id}`);
    return response.data.data!;
  },

  // Hợp đồng sắp hết hạn
  getExpiring: async (days: number = 30): Promise<Contract[]> => {
    const response = await axios.get<ApiResponse<Contract[]>>('/contracts/expiring', {
      params: { days }
    });
    return response.data.data || [];
  },

  // Hợp đồng đã hết hạn
  getExpired: async (): Promise<Contract[]> => {
    const response = await axios.get<ApiResponse<Contract[]>>('/contracts/expired');
    return response.data.data || [];
  },

  // Thống kê hợp đồng theo loại
  getStats: async (): Promise<any> => {
    const response = await axios.get<ApiResponse>('/contracts/stats');
    return response.data;
  },

  // Cập nhật hợp đồng
  update: async (id: number, data: Partial<Contract>): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/contracts/${id}`, data);
    return response.data;
  },

  // Xóa hợp đồng
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/contracts/${id}`);
    return response.data;
  }
};