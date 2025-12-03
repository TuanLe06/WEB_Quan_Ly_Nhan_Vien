import axios from './axiosConfig';
import { Contract, ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const contractApi = {
  // GET /api/contracts
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Contract[]>> => {
    const { data } = await axios.get<PaginatedResponse<Contract[]>>('/contracts', { params });
    return data;
  },

  // GET /api/contracts/:id
  getById: async (id: number): Promise<ApiResponse<Contract>> => {
    const { data } = await axios.get<ApiResponse<Contract>>(`/contracts/${id}`);
    return data;
  },

  // POST /api/contracts
  create: async (contractData: FormData): Promise<ApiResponse<Contract>> => {
    // Sử dụng FormData để upload file
    const { data } = await axios.post<ApiResponse<Contract>>('/contracts', contractData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // quan trọng
    });
    return data;
  },

  // PUT /api/contracts/:id
  update: async (id: number, contractData: FormData): Promise<ApiResponse<Contract>> => {
    // Sử dụng FormData để upload file khi cập nhật
    const { data } = await axios.put<ApiResponse<Contract>>(`/contracts/${id}`, contractData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // DELETE /api/contracts/:id
  delete: async (id: number): Promise<ApiResponse> => {
    const { data } = await axios.delete<ApiResponse>(`/contracts/${id}`);
    return data;
  },

  // GET /api/contracts/expiring?days=30
  getExpiring: async (days: number = 30): Promise<ApiResponse<Contract[]>> => {
    const { data } = await axios.get<ApiResponse<Contract[]>>('/contracts/expiring', {
      params: { days },
    });
    return data;
  },

  // GET /api/contracts/expired
  getExpired: async (): Promise<ApiResponse<Contract[]>> => {
    const { data } = await axios.get<ApiResponse<Contract[]>>('/contracts/expired');
    return data;
  },

  // GET /api/contracts/stats
  getStats: async (): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/contracts/stats');
    return data;
  },
};
