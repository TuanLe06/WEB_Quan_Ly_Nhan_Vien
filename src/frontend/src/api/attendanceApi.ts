import axios from './axiosConfig';
import { Attendance, AttendanceStats, ApiResponse } from '../types';

export const attendanceApi = {
  // Check-in
  checkIn: async (ma_nv: string): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/attendance/checkin', { ma_nv });
    return response.data;
  },

  // Check-out
  checkOut: async (ma_nv: string): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('/attendance/checkout', { ma_nv });
    return response.data;
  },

  // Lấy chấm công hôm nay
  getToday: async (): Promise<Attendance[]> => {
    const response = await axios.get<ApiResponse<Attendance[]>>('/attendance/today');
    return response.data.data || [];
  },

  // Lịch sử chấm công
  getHistory: async (ma_nv: string, params?: { thang?: number; nam?: number }): Promise<Attendance[]> => {
    const response = await axios.get<ApiResponse<Attendance[]>>(`/attendance/history/${ma_nv}`, { params });
    return response.data.data || [];
  },

  // Thống kê chấm công tháng
  getMonthlyStats: async (thang: number, nam: number): Promise<AttendanceStats[]> => {
    const response = await axios.get<ApiResponse<AttendanceStats[]>>('/attendance/stats', {
      params: { thang, nam }
    });
    return response.data.data || [];
  },

  // Nhân viên đi làm muộn
  getLateEmployees: async (params?: { thang?: number; nam?: number }): Promise<Attendance[]> => {
    const response = await axios.get<ApiResponse<Attendance[]>>('/attendance/late', { params });
    return response.data.data || [];
  },

  // Nhân viên chưa checkout
  getNotCheckedOut: async (): Promise<Attendance[]> => {
    const response = await axios.get<ApiResponse<Attendance[]>>('/attendance/not-checked-out');
    return response.data.data || [];
  },

  // Cập nhật chấm công (Admin)
  update: async (id: number, data: { gio_vao: string; gio_ra: string }): Promise<ApiResponse> => {
    const response = await axios.put<ApiResponse>(`/attendance/${id}`, data);
    return response.data;
  },

  // Xóa bản ghi chấm công (Admin)
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(`/attendance/${id}`);
    return response.data;
  }
};