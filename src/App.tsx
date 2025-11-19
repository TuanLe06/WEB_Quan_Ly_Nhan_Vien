import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

/* ====== LAYOUT ====== */
import Sidebar from "./components/Layout/Sidebar";

/* ====== PAGES (bạn đã code) ====== */
import Login from "./frontend/pages/Login";
import Dashboard from "./frontend/pages/Dashboard";

import EmployeeList from "./frontend/pages/Employees/EmployeeList";
import EmployeeForm from "./frontend/pages/Employees/EmployeeForm";
import EmployeeDetail from "./frontend/pages/Employees/EmployeeDetail";

import DepartmentList from "./frontend/pages/Departments/DepartmentList";
import DepartmentForm from "./frontend/pages/Departments/DepartmentForm";

import PositionList from "./frontend/pages/Positions/PositionList";

import AttendanceList from "./frontend/pages/Attendance/AttendanceList";
import CheckInOut from "./frontend/pages/Attendance/CheckInOut";

import SalaryList from "./frontend/pages/Salary/SalaryList";
import SalaryDetail from "./frontend/pages/Salary/SalaryDetail";

import LeaveList from "./frontend/pages/Leave/LeaveList";
import LeaveRequest from "./frontend/pages/Leave/LeaveRequest";
import LeaveApproval from "./frontend/pages/Leave/LeaveApproval";

import ContractList from "./frontend/pages/Contracts/ContractList";
import ContractForm from "./frontend/pages/Contracts/ContractForm";

import ReportDashboard from "./frontend/pages/Reports/ReportDashboard";

/* ====== Auth helpers ====== */
const isAuthed = () => !!localStorage.getItem("token");

function Protected({ children }: { children: ReactNode }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }: { children: ReactNode }) {
  return isAuthed() ? <Navigate to="/" replace /> : children;
}

/* ====== AppShell: ghép Sidebar + nội dung ====== */
function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const showSidebar = isAuthed() && pathname !== "/login";

  // Trang login + khi chưa đăng nhập thì không có sidebar
  if (!showSidebar) {
    return <div>{children}</div>;
  }

  return (
    <div className="app-layout">
      {/* Sidebar dùng class .sidebar trong Sidebar.css */}
      <Sidebar />
      {/* Khu vực nội dung bên phải */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

/* ====== MAIN APP ====== */
export default function App() {
  return (
    <AppShell>
      <Routes>
        {/* Chỉ cho khách */}
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />

        {/* Trang chủ: public (giống portal), sau khi login vào lại / thì vẫn render Dashboard
            nhưng lúc đó AppShell sẽ kèm Sidebar + main-content */}
        <Route path="/" element={<Dashboard />} />

        {/* Employees */}
        <Route
          path="/employees"
          element={
            <Protected>
              <EmployeeList />
            </Protected>
          }
        />
        <Route
          path="/employees/new"
          element={
            <Protected>
              <EmployeeForm />
            </Protected>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <Protected>
              <EmployeeDetail />
            </Protected>
          }
        />

        {/* Departments */}
        <Route
          path="/departments"
          element={
            <Protected>
              <DepartmentList />
            </Protected>
          }
        />
        <Route
          path="/departments/new"
          element={
            <Protected>
              <DepartmentForm />
            </Protected>
          }
        />

        {/* Positions */}
        <Route
          path="/positions"
          element={
            <Protected>
              <PositionList />
            </Protected>
          }
        />

        {/* Attendance */}
        <Route
          path="/attendance"
          element={
            <Protected>
              <AttendanceList />
            </Protected>
          }
        />
        <Route
          path="/attendance/check"
          element={
            <Protected>
              <CheckInOut />
            </Protected>
          }
        />

        {/* Salary */}
        <Route
          path="/salary"
          element={
            <Protected>
              <SalaryList />
            </Protected>
          }
        />
        <Route
          path="/salary/:id"
          element={
            <Protected>
              <SalaryDetail />
            </Protected>
          }
        />

        {/* Leave */}
        <Route
          path="/leave"
          element={
            <Protected>
              <LeaveList />
            </Protected>
          }
        />
        <Route
          path="/leave/request"
          element={
            <Protected>
              <LeaveRequest />
            </Protected>
          }
        />
        <Route
          path="/leave/approval"
          element={
            <Protected>
              <LeaveApproval />
            </Protected>
          }
        />

        {/* Contracts */}
        <Route
          path="/contracts"
          element={
            <Protected>
              <ContractList />
            </Protected>
          }
        />
        <Route
          path="/contracts/new"
          element={
            <Protected>
              <ContractForm />
            </Protected>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <Protected>
              <ReportDashboard />
            </Protected>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 16 }}>404 – Trang không tồn tại</div>} />
      </Routes>
    </AppShell>
  );
}
