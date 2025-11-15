import React, { useEffect, useState } from "react";
import "../../styles/LeaveApproval.css";
// import leaveApi from "../../api/leaveApi"; // backend thật

const USE_API = false;

const LeaveApproval = () => {
  const [requests, setRequests] = useState([]);

  const fakeData = [
    { id:1, name:"Nguyễn Văn A", type:"Nghỉ phép", startDate:"2025-01-05", endDate:"2025-01-10", status:"Chờ duyệt" },
    { id:2, name:"Trần Thị B", type:"Nghỉ ốm", startDate:"2025-01-08", endDate:"2025-01-09", status:"Chờ duyệt" },
  ];

  useEffect(() => {
    if(!USE_API){
      setRequests(fakeData);
      return;
    }

    // Khi backend thật:
    // leaveApi.getAllPending().then(res => setRequests(res.data));
  }, []);

  const handleApprove = (id) => {
    if(!USE_API){
      setRequests(prev => prev.map(r => r.id === id ? {...r, status:"Đã duyệt"} : r));
      return;
    }

    // backend thật:
    // leaveApi.approve(id).then(() => {
    //   setRequests(prev => prev.map(r => r.id === id ? {...r, status:"Đã duyệt"} : r));
    // });
  };

  const handleReject = (id) => {
    if(!USE_API){
      setRequests(prev => prev.map(r => r.id === id ? {...r, status:"Từ chối"} : r));
      return;
    }

    // backend thật:
    // leaveApi.reject(id).then(() => {
    //   setRequests(prev => prev.map(r => r.id === id ? {...r, status:"Từ chối"} : r));
    // });
  };

  return (
    <div className="page-container">
      <h2 className="title">Duyệt yêu cầu nghỉ phép</h2>
      <table className="approval-table">
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
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.type}</td>
              <td>{req.startDate}</td>
              <td>{req.endDate}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "Chờ duyệt" && (
                  <>
                    <button className="btn-approve" onClick={() => handleApprove(req.id)}>Duyệt</button>
                    <button className="btn-reject" onClick={() => handleReject(req.id)}>Từ chối</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApproval;
