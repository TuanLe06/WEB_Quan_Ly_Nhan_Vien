import axios from './axiosConfig';
import { Position, ApiResponse } from '../types';

export const positionApi = {
  // GET /api/positions
  getAll: async (): Promise<ApiResponse<Position[]>> => {
    const { data } = await axios.get<ApiResponse<Position[]>>('/positions');
    return data;
  },

  // POST /api/positions
  create: async (position: Omit<Position, 'so_nhan_vien'>): Promise<ApiResponse<Position>> => {
    const { data } = await axios.post<ApiResponse<Position>>('/positions', position);
    return data;
  },

  // PUT /api/positions/:id
  update: async (ma_chuc_vu: string, position: Partial<Position>): Promise<ApiResponse<Position>> => {
    const { data } = await axios.put<ApiResponse<Position>>(`/positions/${ma_chuc_vu}`, position);
    return data;
  },

  // DELETE /api/positions/:id
  delete: async (ma_chuc_vu: string): Promise<ApiResponse> => {
    const { data } = await axios.delete<ApiResponse>(`/positions/${ma_chuc_vu}`);
    return data;
  },
};