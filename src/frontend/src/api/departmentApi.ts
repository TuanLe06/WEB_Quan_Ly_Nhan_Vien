import axios from './axiosConfig';
import { Department, ApiResponse } from '../types';

export const departmentApi = {
  // GET /api/departments
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    const { data } = await axios.get<ApiResponse<Department[]>>('/departments');
    return data;
  },

  // GET /api/departments/:id
  getById: async (ma_phong: string): Promise<ApiResponse<Department>> => {
    const { data } = await axios.get<ApiResponse<Department>>(`/departments/${ma_phong}`);
    return data;
  },

  // POST /api/departments
  create: async (department: Omit<Department, 'so_nhan_vien'>): Promise<ApiResponse<Department>> => {
    const { data } = await axios.post<ApiResponse<Department>>('/departments', department);
    return data;
  },

  // PUT /api/departments/:id
  update: async (ma_phong: string, department: Partial<Department>): Promise<ApiResponse<Department>> => {
    const { data } = await axios.put<ApiResponse<Department>>(`/departments/${ma_phong}`, department);
    return data;
  },

  // DELETE /api/departments/:id
  delete: async (ma_phong: string): Promise<ApiResponse> => {
    const { data } = await axios.delete<ApiResponse>(`/departments/${ma_phong}`);
    return data;
  },
};
