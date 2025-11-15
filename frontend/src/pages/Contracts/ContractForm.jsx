import React, { useState } from "react";
import "../../styles/ContractForm.css";
// import contractApi from "../../api/contractApi"; // khi backend thật

const USE_API = false;

const ContractForm = () => {
  const [employee, setEmployee] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!employee || !type || !startDate || !endDate){
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if(!USE_API){
      setStatus(`Hợp đồng của ${employee} đã thêm thành công`);
      return;
    }

    // Khi backend thật:
    // contractApi.create({employee, type, startDate, endDate})
    //   .then(() => setStatus(`Hợp đồng của ${employee} đã thêm thành công`))
    //   .catch(() => setStatus("Thêm hợp đồng thất bại"));
  };

  return (
    <div className="page-container">
      <h2 className="title">Thêm hợp đồng</h2>
      <form className="contract-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Tên nhân viên" value={employee} onChange={e => setEmployee(e.target.value)} />
        <input type="text" placeholder="Loại hợp đồng" value={type} onChange={e => setType(e.target.value)} />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button type="submit">Thêm hợp đồng</button>
      </form>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
};

export default ContractForm;
