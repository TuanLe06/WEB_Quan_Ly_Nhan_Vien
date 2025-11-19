import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../frontend/styles/Sidebar.css";


const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token và quay về trang đăng nhập
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Quản lý nhân viên</h2>

      <nav>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/employees"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Nhân viên
        </NavLink>
        <NavLink
          to="/departments"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Phòng ban
        </NavLink>
        <NavLink
          to="/positions"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Chức vụ
        </NavLink>

        <hr className="sidebar-separator" />

        <NavLink
          to="/attendance"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Chấm công
        </NavLink>
        {/* SAU (đúng với App.tsx) */}
<NavLink
  to="/attendance/check"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  Check In/Out
</NavLink>

        <NavLink
          to="/salary"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Lương
        </NavLink>
        <NavLink
          to="/leave"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Nghỉ phép
        </NavLink>
        <NavLink
          to="/leave/request"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Gửi yêu cầu nghỉ
        </NavLink>
        <NavLink
          to="/leave/approval"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Duyệt nghỉ
        </NavLink>
        <NavLink
          to="/contracts"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Hợp đồng
        </NavLink>
        <NavLink
          to="/contracts/new"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Thêm hợp đồng
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Báo cáo
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-user">Hi, Admin</span>
        <button className="sidebar-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
