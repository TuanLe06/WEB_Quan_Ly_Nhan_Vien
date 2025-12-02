import axios from './axiosConfig';
import { Position, ApiResponse } from '../types';

export const positionApi = {
  // Lấy danh sách chức vụ
  getAll: async (): Promise<Position[]> => {
    const response = await axios.get<ApiResponse<Position[]>>('/positions');
    return response.data.data || [];
  },

  // Lấy thông tin chi tiết chức vụ
  getById: async (id: string): Promise<Position> => {
    const response = await axios.get<ApiResponse<Position>>(`/positions/${id}`);
    return response.data.data!;
  },

  // Thêm chức vụ mới
  create: async (data: Position): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/positions', data);
    return response.data;
  },

  // Cập nhật chức vụ
  update: async (id: string, data: Partial<Position>): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/positions/${id}`, data);
    return response.data;
  },

  // Xóa chức vụ
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/positions/${id}`);
    return response.data;
  }
};