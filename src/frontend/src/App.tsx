import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeForm from './pages/Employees/EmployeeForm';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import DepartmentList from './pages/Departments/DepartmentList';
import DepartmentForm from './pages/Departments/DepartmentForm';
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

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                {/* Public route */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/" /> : <Login />} 
                />

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    
                    {/* Employee routes */}
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/employees/new" element={<EmployeeForm />} />
                    <Route path="/employees/:id/edit" element={<EmployeeForm />} />
                    <Route path="/employees/:id" element={<EmployeeDetail />} />
                    
                    {/* Department routes */}
                    <Route path="/departments" element={<DepartmentList />} />
                    <Route path="/departments/new" element={<DepartmentForm />} />
                    <Route path="/departments/:id/edit" element={<DepartmentForm />} />
                    
                    {/* Position routes */}
                    <Route path="/positions" element={<PositionList />} />
                    
                    {/* Attendance routes */}
                    <Route path="/attendance" element={<AttendanceList />} />
                    <Route path="/attendance/check-in-out" element={<CheckInOut />} />
                    
                    {/* Salary routes */}
                    <Route path="/salary" element={<SalaryList />} />
                    <Route path="/salary/:id" element={<SalaryDetail />} />
                    
                    {/* Leave routes */}
                    <Route path="/leave" element={<LeaveList />} />
                    <Route path="/leave/request" element={<LeaveRequest />} />
                    <Route path="/leave/approval" element={<LeaveApproval />} />
                    
                    {/* Contract routes */}
                    <Route path="/contracts" element={<ContractList />} />
                    <Route path="/contracts/new" element={<ContractForm />} />
                    <Route path="/contracts/:id/edit" element={<ContractForm />} />
                </Route>

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;