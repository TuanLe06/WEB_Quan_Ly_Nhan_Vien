// src/pages/Salary/SalaryList.jsx
import React, { useEffect, useState } from "react";
import "../../styles/SalaryList.css";

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

const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN") + " đ";
};

const calculateSalary = (baseSalary, totalHours) => {
  if (!baseSalary) return 0;
  const base = Number(baseSalary);
  const hours = Number(totalHours || 0);
  const hourly = base / 40;

  if (hours <= 40) return base;

  const overtime = hours - 40;
  return base + overtime * hourly * 1.5;
};

const SalaryList = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (USE_API) {
      // TODO: gọi API thật
      return;
    }

    const employees = loadEmployees();

    if (!employees || employees.length === 0) {
      // Demo mặc định nếu chưa có dữ liệu nhân viên
      const demo = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          baseSalary: 4000000,
          totalHours: 45,
        },
        {
          id: 2,
          name: "Trần Thị B",
          baseSalary: 5000000,
          totalHours: 38,
        },
      ];
      setRows(
        demo.map((item) => ({
          ...item,
          totalSalary: calculateSalary(item.baseSalary, item.totalHours),
        }))
      );
      return;
    }

    // Có dữ liệu nhân viên từ localStorage
    const demoHours = [45, 38]; // 2 người đầu giống đề bài, còn lại default 40
    const mapped = employees.map((emp, index) => {
      const totalHours = demoHours[index] ?? 40;
      return {
        id: emp.id || index + 1,
        name: emp.name,
        baseSalary: Number(emp.baseSalary || 0),
        totalHours,
        totalSalary: calculateSalary(emp.baseSalary, totalHours),
      };
    });

    setRows(mapped);
  }, []);

  return (
    <div className="page-container">
      <h2 className="title">Danh sách lương</h2>
      <table className="salary-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Lương cơ bản</th>
            <th>Tổng giờ làm</th>
            <th>Tổng lương</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{formatCurrency(row.baseSalary)}</td>
              <td>{row.totalHours}</td>
              <td>{formatCurrency(row.totalSalary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryList;
