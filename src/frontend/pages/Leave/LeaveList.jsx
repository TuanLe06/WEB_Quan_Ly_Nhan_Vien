import React, { useEffect, useState } from "react";
import "../../styles/LeaveList.css";

const EMP_STORAGE_KEY = "ems_employees";
const LEAVE_STORAGE_KEY = "ems_leave_requests";

function getEmployees() {
  try {
    const raw = localStorage.getItem(EMP_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getLeaves() {
  try {
    const raw = localStorage.getItem(LEAVE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLeaves(leaves) {
  localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(leaves));
}

function getEmpDisplay(emp) {
  return {
    code: emp.code || emp.maNV || emp.id || "",
    name: emp.name || emp.hoTen || emp.fullName || "",
  };
}

// tạo dữ liệu demo nếu chưa có gì trong storage
function buildInitialLeaves() {
  const emps = getEmployees();
  if (emps.length === 0) return [];

  const [e1, e2] = emps;
  const d1 = e1 ? getEmpDisplay(e1) : null;
  const d2 = e2 ? getEmpDisplay(e2) : null;

  const demo = [];
  if (d1) {
    demo.push({
      id: Date.now() - 2,
      employeeCode: d1.code,
      employeeName: d1.name,
      type: "Nghỉ phép",
      startDate: "2025-01-05",
      endDate: "2025-01-10",
      status: "Đã duyệt",
    });
  }
  if (d2) {
    demo.push({
      id: Date.now() - 1,
      employeeCode: d2.code,
      employeeName: d2.name,
      type: "Nghỉ ốm",
      startDate: "2025-01-08",
      endDate: "2025-01-09",
      status: "Chờ duyệt",
    });
  }
  return demo;
}

export default function LeaveList() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    let data = getLeaves();
    if (!data.length) {
      data = buildInitialLeaves();
      saveLeaves(data);
    }
    setLeaves(data);
  }, []);

  return (
    <div className="page-container">
      <h2 className="title">Danh sách nghỉ phép</h2>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Loại nghỉ</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>
                {leave.employeeName}{" "}
                {leave.employeeCode && `(${leave.employeeCode})`}
              </td>
              <td>{leave.type}</td>
              <td>{leave.startDate}</td>
              <td>{leave.endDate}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
          {!leaves.length && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Chưa có dữ liệu nghỉ phép.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
