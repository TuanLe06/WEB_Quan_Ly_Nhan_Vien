import axios from './axiosConfig';
import { Employee, EmployeeFormData, ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const employeeApi = {
  // GET /api/employees
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Employee[]>> => {
    const { data } = await axios.get<PaginatedResponse<Employee[]>>('/employees', { params });
    return data;
  },

  // GET /api/employees/:id
  getById: async (ma_nv: string): Promise<ApiResponse<Employee>> => {
    const { data } = await axios.get<ApiResponse<Employee>>(`/employees/${ma_nv}`);
    return data;
  },

  // POST /api/employees
  create: async (employee: EmployeeFormData): Promise<ApiResponse<Employee>> => {
    const { data } = await axios.post<ApiResponse<Employee>>('/employees', employee);
    return data;
  },

  // PUT /api/employees/:id
  update: async (ma_nv: string, employee: Partial<EmployeeFormData>): Promise<ApiResponse<Employee>> => {
    const { data } = await axios.put<ApiResponse<Employee>>(`/employees/${ma_nv}`, employee);
    return data;
  },

  // DELETE /api/employees/:id
  delete: async (ma_nv: string): Promise<ApiResponse> => {
    const { data } = await axios.delete<ApiResponse>(`/employees/${ma_nv}`);
    return data;
  },

  // GET /api/employees/stats
  getStats: async (): Promise<ApiResponse> => {
    const { data } = await axios.get<ApiResponse>('/employees/stats');
    return data;
  },
};
