import React, { useEffect, useState } from "react";
import "../../styles/LeaveApproval.css";

const LEAVE_STORAGE_KEY = "ems_leave_requests";

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

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    setLeaves(getLeaves());
  }, []);

  const updateStatus = (id, status) => {
    const updated = leaves.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    setLeaves(updated);
    saveLeaves(updated);
  };

  return (
    <div className="page-container">
      <h2 className="title">Duyệt yêu cầu nghỉ phép</h2>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Loại nghỉ</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
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
              <td>
                <button
                  className="approve-btn"
                  onClick={() => updateStatus(leave.id, "Đã duyệt")}
                >
                  Duyệt
                </button>
                <button
                  className="reject-btn"
                  onClick={() => updateStatus(leave.id, "Từ chối")}
                >
                  Từ chối
                </button>
              </td>
            </tr>
          ))}
          {!leaves.length && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Chưa có yêu cầu nghỉ nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
