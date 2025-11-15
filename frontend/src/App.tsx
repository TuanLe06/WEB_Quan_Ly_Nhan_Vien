import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";

// Attendance
import AttendanceList from "./pages/Attendance/AttendanceList";
import CheckInOut from "./pages/Attendance/CheckInOut";

// Salary
import SalaryList from "./pages/Salary/SalaryList";
import SalaryDetail from "./pages/Salary/SalaryDetail";

// Leave
import LeaveList from "./pages/Leave/LeaveList";
import LeaveRequest from "./pages/Leave/LeaveRequest";
import LeaveApproval from "./pages/Leave/LeaveApproval";

// Contracts
import ContractList from "./pages/Contracts/ContractList";
import ContractForm from "./pages/Contracts/ContractForm";

// Reports
import ReportDashboard from "./pages/Reports/ReportDashboard";

import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/attendance" />} />

            {/* Attendance */}
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/checkinout" element={<CheckInOut />} />

            {/* Salary */}
            <Route path="/salary" element={<SalaryList />} />
            <Route path="/salary/:id" element={<SalaryDetail />} />

            {/* Leave */}
            <Route path="/leave" element={<LeaveList />} />
            <Route path="/leave/request" element={<LeaveRequest />} />
            <Route path="/leave/approval" element={<LeaveApproval />} />

            {/* Contracts */}
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/add" element={<ContractForm />} />

            {/* Reports */}
            <Route path="/reports" element={<ReportDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
