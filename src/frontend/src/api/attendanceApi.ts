import axios from './axiosConfig';
import { Attendance, AttendanceStats, ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const attendanceApi = {
  // POST /api/attendance/checkin
  checkIn: async (ma_nv: string): Promise<ApiResponse<Attendance>> => {
    const { data } = await axios.post<ApiResponse<Attendance>>('/attendance/checkin', { ma_nv });
    return data;
  },

  // POST /api/attendance/checkout
  checkOut: async (ma_nv: string): Promise<ApiResponse<Attendance>> => {
    const { data } = await axios.post<ApiResponse<Attendance>>('/attendance/checkout', { ma_nv });
    return data;
  },

  // GET /api/attendance/today
  getToday: async (): Promise<ApiResponse<Attendance[]>> => {
    const { data } = await axios.get<ApiResponse<Attendance[]>>('/attendance/today');
    return data;
  },

  // GET /api/attendance/history/:ma_nv
  getHistory: async (ma_nv: string, params?: any): Promise<PaginatedResponse<Attendance[]>> => {
    const { data } = await axios.get<PaginatedResponse<Attendance[]>>(`/attendance/history/${ma_nv}`, { params });
    return data;
  },

  // GET /api/attendance/stats
  getStats: async (params?: any): Promise<ApiResponse<AttendanceStats[]>> => {
    const { data } = await axios.get<ApiResponse<AttendanceStats[]>>('/attendance/stats', { params });
    return data;
  },

  // GET /api/attendance/late
  getLate: async (date?: string): Promise<ApiResponse<Attendance[]>> => {
    const { data } = await axios.get<ApiResponse<Attendance[]>>('/attendance/late', { 
      params: { date } 
    });
    return data;
  },

  // GET /api/attendance/not-checked-out
  getNotCheckedOut: async (): Promise<ApiResponse<Attendance[]>> => {
    const { data } = await axios.get<ApiResponse<Attendance[]>>('/attendance/not-checked-out');
    return data;
  },
};