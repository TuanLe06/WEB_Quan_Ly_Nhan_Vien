import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeForm from './pages/Employees/EmployeeForm';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import DepartmentList from './pages/Departments/DepartmentList';
import DepartmentForm from './pages/Departments/DepartmentsForm';
import PositionList from './pages/Positions/PositionList';
import AttendanceList from './pages/Attendance/AttendanceList';
import CheckInOut from './pages/Attendance/CheckInOut';
import SalaryList from './pages/Salary/SalaryList';
import SalaryDetail from './pages/Salary/SalaryDetail';
import LeaveList from './pages/Leave/LeaveList';
import LeaveRequest from './pages/Leave/LeaveRequest';
import LeaveApproval from './pages/Leave/LeaveApproval';
import ContractList from './pages/Contracts/ContractList';
import ContractForm from './pages/Contracts/ContractForm';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employee Routes */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="employees/:id/edit" element={<EmployeeForm />} />
            
            {/* Department Routes */}
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/new" element={<DepartmentForm />} />
            <Route path="departments/:id/edit" element={<DepartmentForm />} />
            
            {/* Position Routes */}
            <Route path="positions" element={<PositionList />} />
            
            {/* Attendance Routes */}
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="attendance/check" element={<CheckInOut />} />
            
            {/* Salary Routes */}
            <Route path="salary" element={<SalaryList />} />
            <Route path="salary/:id" element={<SalaryDetail />} />
            
            {/* Leave Routes */}
            <Route path="leave" element={<LeaveList />} />
            <Route path="leave/request" element={<LeaveRequest />} />
            <Route path="leave/approval" element={<LeaveApproval />} />
            
            {/* Contract Routes */}
            <Route path="contracts" element={<ContractList />} />
            <Route path="contracts/new" element={<ContractForm />} />
            <Route path="contracts/:id/edit" element={<ContractForm />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
