import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import RoleBasedDashboard from './components/RoleBasedDashboard'; // ← THÊM DÒNG NÀY
import Layout from './components/layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // Admin Dashboard (GIỮ cho routes khác nếu cần)
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard'; // Employee Dashboard
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeForm from './pages/Employees/EmployeeForm';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import DepartmentList from './pages/Departments/DepartmentList';
import DepartmentForm from './pages/Departments/DepartmentsForm';
import PositionList from './pages/Positions/PositionList';
import AttendanceList from './pages/Attendance/AttendanceList';
import CheckInOut from './pages/Attendance/CheckInOut';
import SalaryList from './pages/Salary/SalaryList';
import SalaryDeductedList from './pages/Salary/SalaryDeductedList';
import SalaryHistory from './pages/Salary/SalaryHistory';
import LeaveList from './pages/Leave/LeaveList';
import LeaveRequest from './pages/Leave/LeaveRequest';
import LeaveApproval from './pages/Leave/LeaveApproval';
import ContractList from './pages/Contracts/ContractList';
import ContractForm from './pages/Contracts/ContractForm';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import './App.css';
import EmployeeAttendance from './pages/Attendance/EmployeeAttendance';
import EmployeeRegister from './pages/EmployeeRegister/EmployeeRegister';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard - Động theo role */}
            <Route path="dashboard" element={<RoleBasedDashboard />} />
            
            {/* Employee Routes */}
            <Route path="employees">
              <Route index element={
                <RoleRoute allowedRoles={['Admin', 'KeToan']}>
                  <EmployeeList />
                </RoleRoute>
              } />
              <Route path="new" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <EmployeeForm />
                </RoleRoute>
              } />
              <Route path=":id" element={<EmployeeDetail />} />
              <Route path=":id/edit" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <EmployeeForm />
                </RoleRoute>
              } />
            </Route>
            
            {/* Department Routes */}
            <Route path="departments">
              <Route index element={<DepartmentList />} />
              <Route path="new" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <DepartmentForm />
                </RoleRoute>
              } />
              <Route path=":id/edit" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <DepartmentForm />
                </RoleRoute>
              } />
            </Route>
            
            {/* Position Routes */}
            <Route path="positions" element={
              <RoleRoute allowedRoles={['Admin']}>
                <PositionList />
              </RoleRoute>
            } />
            
            {/* Attendance Routes */}
            <Route path="attendance">
              <Route index element={
                <RoleRoute allowedRoles={['Admin', 'KeToan']} redirectTo='/employee-attendance'>
                <AttendanceList />
                </RoleRoute>
              } />
              <Route path="check" element={<CheckInOut />} />
            </Route>
            <Route path="employee-attendance" element={
              <RoleRoute allowedRoles={['NhanVien']}>
                <EmployeeAttendance />
              </RoleRoute>
            } 
            />
            
            {/* Salary Routes */}
            <Route path="salary">
              <Route index element={
                <RoleRoute allowedRoles={['Admin', 'KeToan']} redirectTo='/history'>
                  <SalaryList />
                </RoleRoute>
              } />
              <Route path="deducted" element={
                <RoleRoute allowedRoles={['Admin', 'KeToan']}>
                  <SalaryDeductedList />
                </RoleRoute>
              } />
            </Route>
            <Route path="history" element={
              <RoleRoute allowedRoles={['NhanVien']}>
                <SalaryHistory />
              </RoleRoute>
            } />


            {/* Leave Routes */}
            <Route path="leave">
              <Route index element={  
                <RoleRoute allowedRoles={['Admin']} redirectTo='/dashboard'>
                <LeaveList />
                </RoleRoute>
              } />
              <Route path="request" element={<LeaveRequest />} />
              <Route path="approval" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <LeaveApproval />
                </RoleRoute>
              } />
            </Route>
            
            {/* Contract Routes */}
            <Route path="contracts">
              <Route index element={
                <RoleRoute allowedRoles={['Admin']}>
                <ContractList />
                </RoleRoute>
              } />
              <Route path="new" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <ContractForm />
                </RoleRoute>
              } />
              <Route path=":id/edit" element={
                <RoleRoute allowedRoles={['Admin']}>
                  <ContractForm />
                </RoleRoute>
              } />
            </Route>
            <Route path="employee-register" element={
              <RoleRoute allowedRoles={['Admin']}>
                <EmployeeRegister />
              </RoleRoute>
            } />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;