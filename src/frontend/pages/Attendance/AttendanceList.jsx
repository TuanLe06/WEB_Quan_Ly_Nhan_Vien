// src/pages/Attendance/AttendanceList.jsx
import React, { useEffect, useState } from "react";
import "../../styles/AttendanceList.css";

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

const buildDemoAttendance = (employees) => {
  const [e1, e2, ...rest] = employees;
  const rows = [];

  if (e1) {
    rows.push({
      id: 1,
      employeeName: e1.name,
      date: "2025-01-01",
      checkIn: "08:00",
      checkOut: "17:00",
    });
  }

  if (e2) {
    rows.push({
      id: 2,
      employeeName: e2.name,
      date: "2025-01-01",
      checkIn: "08:15",
      checkOut: "17:20",
    });
  }

  rest.forEach((emp, index) => {
    rows.push({
      id: rows.length + 1,
      employeeName: emp.name,
      date: "2025-01-01",
      checkIn: "08:00",
      checkOut: "17:00",
    });
  });

  return rows;
};

const AttendanceList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (USE_API) {
      // TODO: gọi API thật
      return;
    }

    const employees = loadEmployees();

    if (!employees || employees.length === 0) {
      // Dữ liệu demo mặc định như ảnh mẫu
      setRecords([
        {
          id: 1,
          employeeName: "Nguyễn Văn A",
          date: "2025-01-01",
          checkIn: "08:00",
          checkOut: "17:00",
        },
        {
          id: 2,
          employeeName: "Trần Thị B",
          date: "2025-01-01",
          checkIn: "08:15",
          checkOut: "17:20",
        },
      ]);
    } else {
      setRecords(buildDemoAttendance(employees));
    }
  }, []);

  return (
    <div className="page-container">
      <h2 className="title">Danh sách chấm công</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Ngày</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {records.map((row) => (
            <tr key={row.id}>
              <td>{row.employeeName}</td>
              <td>{row.date}</td>
              <td>{row.checkIn}</td>
              <td>{row.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;

