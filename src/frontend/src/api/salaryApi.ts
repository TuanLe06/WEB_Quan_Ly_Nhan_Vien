import axios from './axiosConfig';
import { Salary, ApiResponse } from '../types';

export const salaryApi = {
  // POST /api/salary/calculate
  calculateOne: async (ma_nv: string, thang: number, nam: number): Promise<ApiResponse<Salary>> => {
    const { data } = await axios.post<ApiResponse<Salary>>('/salary/calculate', {
      ma_nv,
      thang,
      nam,
    });
    return data;
  },

  // POST /api/salary/calculate-all
  calculateAll: async (thang: number, nam: number): Promise<ApiResponse> => {
    const { data } = await axios.post<ApiResponse>('/salary/calculate-all', {
      thang,
      nam,
    });
    return data;
  },

  // GET /api/salary/monthly?thang=1&nam=2024&ma_phong=P01
  getMonthly: async (thang: number, nam: number, ma_phong?: string): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>('/salary/monthly', {
      params: { thang, nam, ma_phong },
    });
    return data;
  },

  // GET /api/salary/employee/:ma_nv?thang=1&nam=2024
  getByEmployee: async (ma_nv: string, thang?: number, nam?: number): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>(`/salary/employee/${ma_nv}`, {
      params: { thang, nam },
    });
    return data;
  },

  // GET /api/salary/top?thang=1&nam=2024&limit=10
  getTop: async (thang: number, nam: number, limit: number = 10): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>('/salary/top', {
      params: { thang, nam, limit },
    });
    return data;
  },

  // GET /api/salary/deducted?thang=1&nam=2024
  getDeducted: async (thang: number, nam: number): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>('/salary/deducted', {
      params: { 
        thang, 
        nam 
      },
    });
    return data;
  },

  // GET /api/salary/by-department?thang=1&nam=2024
  getByDepartment: async (thang: number, nam: number): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/salary/by-department', {
      params: { thang, nam },
    });
    return data;
  },

  // GET /api/salary/compare?nam=2024&soThang=6
  compare: async (nam: number, soThang: number = 6): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/salary/compare', {
      params: { nam, soThang },
    });
    return data;
  },

  // DELETE /api/salary/:id
  delete: async (id: number): Promise<ApiResponse> => {
    const { data } = await axios.delete<ApiResponse>(`/salary/${id}`);
    return data;
  },
};