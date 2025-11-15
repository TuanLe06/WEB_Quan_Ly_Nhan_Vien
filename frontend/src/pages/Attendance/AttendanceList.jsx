import React, { useEffect, useState } from "react";
import "../../styles/AttendanceList.css";
// import attendanceApi from "../../api/attendanceApi"; // khi backend thật xong

const USE_API = false;

const AttendanceList = () => {
  const [data, setData] = useState([]);

  const fakeData = [
    { id: 1, name: "Nguyễn Văn A", date: "2025-01-01", checkIn: "08:00", checkOut: "17:00" },
    { id: 2, name: "Trần Thị B", date: "2025-01-01", checkIn: "08:15", checkOut: "17:20" },
  ];

  useEffect(() => {
    if (!USE_API) {
      setData(fakeData);
      return;
    }
    // Khi backend thật:
    // attendanceApi.getAll().then(res => setData(res.data));
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
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.checkIn}</td>
              <td>{item.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
