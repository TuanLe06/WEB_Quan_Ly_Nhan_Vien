import React, { useEffect, useState } from "react";
import "../../styles/ContractList.css";
// import contractApi from "../../api/contractApi"; // khi backend thật

const USE_API = false;

const ContractList = () => {
  const [contracts, setContracts] = useState([]);

  const fakeData = [
    { id:1, employee:"Nguyễn Văn A", type:"Hợp đồng 1 năm", startDate:"2025-01-01", endDate:"2025-12-31" },
    { id:2, employee:"Trần Thị B", type:"Hợp đồng thử việc", startDate:"2025-02-01", endDate:"2025-05-01" },
  ];

  useEffect(() => {
    if(!USE_API){
      setContracts(fakeData);
      return;
    }

    // Khi backend thật:
    // contractApi.getAll().then(res => setContracts(res.data));
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
          {contracts.map(c => (
            <tr key={c.id}>
              <td>{c.employee}</td>
              <td>{c.type}</td>
              <td>{c.startDate}</td>
              <td>{c.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;
