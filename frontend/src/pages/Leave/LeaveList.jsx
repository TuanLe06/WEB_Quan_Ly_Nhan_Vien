import React, { useEffect, useState } from "react";
import "../../styles/LeaveList.css";
// import leaveApi from "../../api/leaveApi"; // khi backend thật xong

const USE_API = false;

const LeaveList = () => {
  const [data, setData] = useState([]);

  const fakeData = [
    { id:1, name:"Nguyễn Văn A", type:"Nghỉ phép", startDate:"2025-01-05", endDate:"2025-01-10", status:"Đã duyệt" },
    { id:2, name:"Trần Thị B", type:"Nghỉ ốm", startDate:"2025-01-08", endDate:"2025-01-09", status:"Chờ duyệt" },
  ];

  useEffect(() => {
    if(!USE_API){
      setData(fakeData);
      return;
    }

    // Khi backend thật xong:
    // leaveApi.getAll().then(res => setData(res.data));
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
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveList;
