import React, { useState } from "react";
import "../../styles/LeaveRequest.css";// import leaveApi from "../../api/leaveApi"; // khi backend thật xong

const USE_API = false;

const LeaveRequest = () => {
  const [employee, setEmployee] = useState("");
  const [type, setType] = useState("Nghỉ phép");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!employee || !startDate || !endDate) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if(!USE_API){
      // Fake submit
      setStatus(`Yêu cầu của ${employee} đã gửi thành công`);
      return;
    }

    // Khi backend thật:
    // leaveApi.create({employee, type, startDate, endDate})
    //   .then(res => setStatus(`Yêu cầu của ${employee} đã gửi thành công`))
    //   .catch(err => setStatus("Gửi yêu cầu thất bại"));
  };

  return (
    <div className="page-container">
      <h2 className="title">Gửi yêu cầu nghỉ phép</h2>
      <form className="leave-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Tên nhân viên" value={employee} onChange={e => setEmployee(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="Nghỉ phép">Nghỉ phép</option>
          <option value="Nghỉ ốm">Nghỉ ốm</option>
        </select>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button type="submit">Gửi yêu cầu</button>
      </form>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
};

export default LeaveRequest;
