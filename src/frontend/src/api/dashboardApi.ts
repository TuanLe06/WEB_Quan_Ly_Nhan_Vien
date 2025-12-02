import axios from './axiosConfig';
import { DashboardStats, EmployeesByDepartment, SalaryTrend, ApiResponse } from '../types';

export const dashboardApi = {
  // GET /api/dashboard/stats
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await axios.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data;
  },

  // GET /api/dashboard/employees-by-department
  getEmployeesByDepartment: async (): Promise<ApiResponse<EmployeesByDepartment[]>> => {
    const { data } = await axios.get<ApiResponse<EmployeesByDepartment[]>>('/dashboard/employees-by-department');
    return data;
  },

  // GET /api/dashboard/employees-by-position
  getEmployeesByPosition: async (): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/dashboard/employees-by-position');
    return data;
  },

  // GET /api/dashboard/salary-trend?months=6
  getSalaryTrend: async (months: number = 6): Promise<ApiResponse<SalaryTrend[]>> => {
    const { data } = await axios.get<ApiResponse<SalaryTrend[]>>('/dashboard/salary-trend', {
      params: { months },
    });
    return data;
  },

  // GET /api/dashboard/attendance-stats
  getAttendanceStats: async (params?: any): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/dashboard/attendance-stats', { params });
    return data;
  },

  // GET /api/dashboard/top-employees?limit=10
  getTopEmployees: async (limit: number = 10): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/dashboard/top-employees', {
      params: { limit },
    });
    return data;
  },

  // GET /api/dashboard/leave-stats
  getLeaveStats: async (params?: any): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/dashboard/leave-stats', { params });
    return data;
  },

  // GET /api/dashboard/recent-activities?limit=20
  getRecentActivities: async (limit: number = 20): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/dashboard/recent-activities', {
      params: { limit },
    });
    return data;
  },
};