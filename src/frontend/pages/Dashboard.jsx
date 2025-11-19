import React from "react";
import { Link } from "react-router-dom";
import "../../frontend/styles/Dashboard.css";

export default function Dashboard() {
  const authed = !!localStorage.getItem("token");

  // CHƯA đăng nhập: trang chủ public với nút vào /login
  if (!authed) {
    return (
      <div className="dashboard-public">
        <div className="dashboard-public-box">
          <h2>Hệ thống quản lý nhân viên</h2>
          <p>Vui lòng đăng nhập để sử dụng các chức năng quản lý.</p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className="btn-login">Đăng nhập</button>
          </Link>
        </div>
      </div>
    );
  }

  // ĐÃ đăng nhập: hiển thị ảnh công ty + giới thiệu
  return (
    <div className="page-container dashboard-container">
      <h2 className="title">Tổng quan hệ thống</h2>

      <div className="dashboard-content">
        <div className="dashboard-image-wrap">
          <img
            src="/images/image.jpg"
            alt="Công ty"
            className="dashboard-image"
          />
        </div>

        <div className="dashboard-info">
          <h3>Chào mừng bạn đến với hệ thống quản lý nhân viên</h3>
          <p>
            Đây là trang tổng quan sau khi đăng nhập. Bạn có thể sử dụng menu
            bên trái để truy cập nhanh tới các chức năng:
          </p>
          <ul>
            <li>Quản lý thông tin nhân viên, phòng ban, chức vụ.</li>
            <li>Chấm công, theo dõi giờ làm việc và tính lương.</li>
            <li>Quản lý nghỉ phép, hợp đồng và các báo cáo thống kê.</li>
          </ul>
          <p>
            Ảnh bên cạnh là hình ảnh minh hoạ cho công ty/doanh nghiệp của bạn.
            Bạn có thể thay bằng logo hoặc hình toà nhà công ty để phù hợp đồ án.
          </p>
        </div>
      </div>
    </div>
  );
}
