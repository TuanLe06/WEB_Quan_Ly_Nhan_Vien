import axios from './axiosConfig';
import { Salary, ApiResponse, PaginatedResponse } from '../types';

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

  // GET /api/salary/monthly?thang=1&nam=2024
  getMonthly: async (thang: number, nam: number): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>('/salary/monthly', {
      params: { thang, nam },
    });
    return data;
  },

  // GET /api/salary/employee/:ma_nv
  getByEmployee: async (ma_nv: string, params?: any): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>(`/salary/employee/${ma_nv}`, { params });
    return data;
  },

  // GET /api/salary/top?limit=10
  getTop: async (limit: number = 10): Promise<ApiResponse<Salary[]>> => {
    const { data } = await axios.get<ApiResponse<Salary[]>>('/salary/top', {
      params: { limit },
    });
    return data;
  },

  // GET /api/salary/by-department
  getByDepartment: async (thang: number, nam: number): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/salary/by-department', {
      params: { thang, nam },
    });
    return data;
  },

  // GET /api/salary/compare
  compare: async (thang1: number, nam1: number, thang2: number, nam2: number): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/salary/compare', {
      params: { thang1, nam1, thang2, nam2 },
    });
    return data;
  },
};
