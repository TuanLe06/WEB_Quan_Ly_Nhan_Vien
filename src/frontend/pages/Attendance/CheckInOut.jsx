import React, { useState } from "react";
import "../../styles/CheckInOut.css";
// import attendanceApi from "../../api/attendanceApi"; // backend thật

const USE_API = false;

const CheckInOut = () => {
  const [status, setStatus] = useState("Chưa check in");

  const handleCheckIn = () => {
    if(!USE_API){
      setStatus("Đã check in: 08:00");
      return;
    }
    // Khi backend thật:
    // attendanceApi.checkIn().then(res => setStatus(`Đã check in: ${res.time}`));
  };

  const handleCheckOut = () => {
    if(!USE_API){
      setStatus("Đã check out: 17:00");
      return;
    }
    // Khi backend thật:
    // attendanceApi.checkOut().then(res => setStatus(`Đã check out: ${res.time}`));
  };

  return (
    <div className="page-container">
      <h2 className="title">Check In / Check Out</h2>
      <p>Trạng thái: {status}</p>
      <button onClick={handleCheckIn}>Check In</button>
      <button onClick={handleCheckOut}>Check Out</button>
    </div>
  );
};

export default CheckInOut;