// src/pages/Reports/ReportDashboard.jsx
import React, { useEffect, useState } from "react";
import "../../styles/ReportDashboard.css";

const EMP_STORAGE_KEY = "ems_employees";
const USE_API = false;

const loadEmployees = () => {
  try {
    const raw = localStorage.getItem(EMP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Không đọc được ems_employees:", e);
    return [];
  }
};

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN") + " VND";

const buildDemoReports = (employees) => {
  const [e1, e2] = employees;
  const reports = [];

  if (e1) {
    const base = Number(e1.baseSalary || 4000000);
    // Ví dụ: tháng 1 có OT => 4.75m, các tháng còn lại = base
    const effective = base === 4000000 ? 4750000 : base;
    const months = Array.from({ length: 12 }, (_, i) =>
      i === 0 ? effective : base
    );
    reports.push({
      id: 1,
      employeeName: e1.name,
      year: 2025,
      months,
    });
  }

  if (e2) {
    const base = Number(e2.baseSalary || 5000000);
    const months = Array(12).fill(base);
    reports.push({
      id: 2,
      employeeName: e2.name,
      year: 2025,
      months,
    });
  }

  return reports;
};

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (USE_API) {
      // TODO: gọi API thật
      return;
    }

    const employees = loadEmployees();
    if (!employees || employees.length === 0) {
      // Nếu chưa có nhân viên thì tạo demo cứng
      const demoEmployees = [
        { name: "Nguyễn Văn A", baseSalary: 4000000 },
        { name: "Trần Thị B", baseSalary: 5000000 },
      ];
      setReports(buildDemoReports(demoEmployees));
    } else {
      setReports(buildDemoReports(employees));
    }
  }, []);

  return (
    <div className="page-container">
      <h2 className="title">Báo cáo tổng thu nhập theo năm</h2>

      {reports.map((report) => (
        <div key={report.id} className="report-card">
          <h3>
            {report.employeeName} - {report.year}
          </h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Lương thực nhận (VND)</th>
              </tr>
            </thead>
            <tbody>
              {report.months.map((value, index) => (
                <tr key={index}>
                  <td>Tháng {index + 1}</td>
                  <td>{formatCurrency(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ReportDashboard;
