import axios from './axiosConfig';
import { ApiResponse } from '../types';

export interface EmployeeDashboardData {
  employee: {
    ma_nv: string;
    ten_nv: string;
    email: string;
    so_dien_thoai: string;
    avatar?: string;
    ngay_sinh: string;
    gioi_tinh: string;
    dia_chi: string;
    ngay_vao_lam: string;
    luong_co_ban: number;
    ten_phong: string;
    ma_phong: string;
    ten_chuc_vu: string;
    ma_chuc_vu: string;
    tuoi: number;
    nam_cong_tac: number;
  };
  attendance: {
    current: {
      so_ngay_lam: number;
      tong_gio: number;
      gio_trung_binh: number;
      di_muon: number;
    };
    previous?: {
      so_ngay_lam: number;
      tong_gio: number;
      gio_trung_binh: number;
      di_muon: number;
    };
    today: {
      id: number;
      ma_nv?: string;
      ngay_lam: string;
      gio_vao: string;
      gio_ra: string | null;
      so_gio: number;
      trang_thai: string;
    } | null;
    recent: Array<{
      ngay_lam: string;
      gio_vao: string;
      gio_ra: string | null;
      so_gio: number;
      trang_thai: string;
    }>;
  };

  leave: {
    da_duyet: number;
    cho_duyet: number;
    tu_choi: number;
    da_nghi_nam_nay: number;
    recent: Array<{
      id: number;
      ngay_bat_dau: string;
      ngay_ket_thuc: string;
      loai_phep: string;
      ly_do: string;
      trang_thai: string;
      ngay_tao: string;
      so_ngay: number;
    }>;
  };
  salary: {
    latest: {
      thang: number;
      nam: number;
      tong_gio: number;
      luong_co_ban: number;
      luong_them: number;
      tru_luong: number;
      luong_thuc_nhan: number;
      ngay_tinh: string;
    } | null;

    previous?: {
      thang: number;
      nam: number;
      tong_gio: number;
      luong_co_ban: number;
      luong_them: number;
      tru_luong: number;
      luong_thuc_nhan: number;
      ngay_tinh: string;
    } | null;

    history: Array<{
      thang: number;
      nam: number;
      tong_gio: number;
      luong_thuc_nhan: number;
    }>;
  }

  contract: {
    id: number;
    loai_hop_dong: string;
    ngay_bat_dau: string;
    ngay_ket_thuc: string | null;
    luong_co_ban: number;
    phu_cap: number;
    ngay_con_lai: number;
  } | null;
  notifications: Array<{
    type: 'info' | 'warning' | 'danger' | 'success';
    title: string;
    message: string;
  }>;
  summary: {
    gio_lam_thang_nay: number;
    gio_con_lai: number;
    ngay_phep_da_dung: number;
    ngay_phep_con_lai: number;
  };
}

export const employeeDashboardApi = {
  // Lấy dashboard cho nhân viên
  getEmployeeDashboard: async (ma_nv: string): Promise<ApiResponse<EmployeeDashboardData>> => {
    const { data } = await axios.get<ApiResponse<EmployeeDashboardData>>(`/dashboard/employee/${ma_nv}`);
    return data;
  },
};