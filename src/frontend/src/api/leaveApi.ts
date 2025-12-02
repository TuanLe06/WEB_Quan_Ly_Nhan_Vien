import axios from './axiosConfig';
import { Leave, LeaveFormData, ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const leaveApi = {
  // GET /api/leave
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Leave[]>> => {
    const { data } = await axios.get<PaginatedResponse<Leave[]>>('/leave', { params });
    return data;
  },

  // GET /api/leave/:id
  getById: async (id: number): Promise<ApiResponse<Leave>> => {
    const { data } = await axios.get<ApiResponse<Leave>>(`/leave/${id}`);
    return data;
  },

  // POST /api/leave
  create: async (leave: LeaveFormData): Promise<ApiResponse<Leave>> => {
    const { data } = await axios.post<ApiResponse<Leave>>('/leave', leave);
    return data;
  },

  // PUT /api/leave/:id/status
  updateStatus: async (id: number, trang_thai: 'Đã duyệt' | 'Từ chối'): Promise<ApiResponse> => {
    const { data } = await axios.put<ApiResponse>(`/leave/${id}/status`, { trang_thai });
    return data;
  },

  // GET /api/leave/today
  getToday: async (): Promise<ApiResponse<Leave[]>> => {
    const { data } = await axios.get<ApiResponse<Leave[]>>('/leave/today');
    return data;
  },

  // GET /api/leave/stats
  getStats: async (params?: any): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/leave/stats', { params });
    return data;
  },
};
