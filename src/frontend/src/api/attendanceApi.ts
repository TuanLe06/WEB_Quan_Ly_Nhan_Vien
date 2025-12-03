import axios from './axiosConfig';
import { Attendance, AttendanceStats, ApiResponse, PaginatedResponse } from '../types';

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
  getHistory: async (ma_nv: string, params?: { thang?: number; nam?: number }): Promise<ApiResponse<Attendance[]>> => {
    const { data } = await axios.get<ApiResponse<Attendance[]>>(`/attendance/history/${ma_nv}`, { params });
    return data;
  },

  // GET /api/attendance/stats
  getStats: async (params?: { thang?: number; nam?: number }): Promise<ApiResponse<AttendanceStats[]>> => {
    const { data } = await axios.get<ApiResponse<AttendanceStats[]>>('/attendance/stats', { params });
    return data;
  },

  // GET /api/attendance/late - FIXED: Backend expects thang and nam, not date
  getLate: async (params?: { thang?: number; nam?: number }): Promise<ApiResponse<any[]>> => {
    const { data } = await axios.get<ApiResponse<any[]>>('/attendance/late', { params });
    return data;
  },

  // GET /api/attendance/not-checked-out
  getNotCheckedOut: async (): Promise<ApiResponse<any[]>> => {
    const { data } = await axios.get<ApiResponse<any[]>>('/attendance/not-checked-out');
    return data;
  },

  // PUT /api/attendance/:id - For admin updates
  update: async (id: number, data: { gio_vao?: string; gio_ra?: string }): Promise<ApiResponse<null>> => {
    const response = await axios.put<ApiResponse<null>>(`/attendance/${id}`, data);
    return response.data;
  },

  // DELETE /api/attendance/:id - For admin deletions
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axios.delete<ApiResponse<null>>(`/attendance/${id}`);
    return response.data;
  },
};