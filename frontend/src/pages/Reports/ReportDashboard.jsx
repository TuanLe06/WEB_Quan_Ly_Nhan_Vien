import React, { useEffect, useState } from "react";
import "../../styles/ReportDashboard.css";
// import reportApi from "../../api/reportApi"; // khi backend thật

const USE_API = false;

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);

  const fakeData = [
    { id: 1, name: "Nguyễn Văn A", year: 2025, monthlyIncome: [4750000,4000000,4000000,4000000,4000000,4000000,4000000,4000000,4000000,4000000,4000000,4000000] },
    { id: 2, name: "Trần Thị B", year: 2025, monthlyIncome: [5000000,5000000,5000000,5000000,5000000,5000000,5000000,5000000,5000000,5000000,5000000,5000000] },
  ];

  useEffect(() => {
    if(!USE_API){
      setReports(fakeData);
      return;
    }

    // Khi backend thật:
    // reportApi.getYearly().then(res => setReports(res.data));
  }, []);

  return (
    <div className="page-container">
      <h2 className="title">Báo cáo tổng thu nhập theo năm</h2>
      {reports.map(r => (
        <div key={r.id} className="report-card">
          <h3>{r.name} - {r.year}</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Lương thực nhận (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {r.monthlyIncome.map((income, idx) => (
                <tr key={idx}>
                  <td>Tháng {idx+1}</td>
                  <td>{income.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ReportDashboard;
