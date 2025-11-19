// src/pages/Contracts/ContractList.jsx
import React, { useEffect, useState } from "react";
import "../../styles/ContractList.css";

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

const buildDemoContracts = (employees) => {
  const [e1, e2] = employees;
  return [
    {
      id: 1,
      employeeName: e1?.name || "Nguyễn Văn A",
      type: "Hợp đồng 1 năm",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
    },
    {
      id: 2,
      employeeName: e2?.name || "Trần Thị B",
      type: "Hợp đồng thử việc",
      startDate: "2025-02-01",
      endDate: "2025-05-01",
    },
  ];
};

const ContractList = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    if (USE_API) {
      // TODO: gọi API thật
      return;
    }

    const employees = loadEmployees();
    if (!employees || employees.length === 0) {
      setContracts(buildDemoContracts([]));
    } else {
      setContracts(buildDemoContracts(employees));
    }
  }, []);

  return (
    <div className="page-container">
      <h2 className="title">Danh sách hợp đồng</h2>
      <table className="contract-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Loại hợp đồng</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id}>
              <td>{contract.employeeName}</td>
              <td>{contract.type}</td>
              <td>{contract.startDate}</td>
              <td>{contract.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;
