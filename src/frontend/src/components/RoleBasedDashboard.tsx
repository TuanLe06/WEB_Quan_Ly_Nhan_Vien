import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard/Dashboard'; // Admin/KeToan Dashboard (CŨ)
import EmployeeDashboard from '../pages/Dashboard/EmployeeDashboard'; // Employee Dashboard (MỚI)

/**
 * Component tự động hiển thị dashboard phù hợp theo role
 * - NhanVien: EmployeeDashboard (Dashboard riêng với thông tin cá nhân)
 * - Admin/KeToan: Dashboard (Dashboard quản lý tổng quan - GIỮ NGUYÊN)
 */
const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  // NhanVien -> EmployeeDashboard (MỚI)
  if (user?.vai_tro === 'NhanVien') {
    return <EmployeeDashboard />;
  }

  // Admin, KeToan -> Dashboard (CŨ - KHÔNG THAY ĐỔI GÌ)
  return <Dashboard />;
};

export default RoleBasedDashboard;