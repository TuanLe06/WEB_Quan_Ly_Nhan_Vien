import React, { useEffect, useState } from "react";
import "../../styles/SalaryList.css";
// import salaryApi from "../../api/salaryApi"; // backend thật

const USE_API = false;

const SalaryList = () => {
  const [data, setData] = useState([]);

  const fakeData = [
    { id: 1, name: "Nguyễn Văn A", basicSalary: 4000000, totalHours: 45 },
    { id: 2, name: "Trần Thị B", basicSalary: 5000000, totalHours: 38 },
  ];

  useEffect(() => {
    if(!USE_API){
      setData(fakeData);
      return;
    }
    // Khi backend thật:
    // salaryApi.getAll().then(res => setData(res.data));
  }, []);

  const calculateSalary = (basic, hours) => {
    if(hours <= 40) return basic;
    const overtime = hours - 40;
    return basic + (basic / 40) * overtime * 1.5;
  };

  return (
    <div className="page-container">
      <h2 className="title">Danh sách lương</h2>
      <table className="salary-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Lương cơ bản</th>
            <th>Tổng giờ làm</th>
            <th>Tổng lương</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.basicSalary.toLocaleString()}</td>
              <td>{item.totalHours}</td>
              <td>{calculateSalary(item.basicSalary, item.totalHours).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryList;
