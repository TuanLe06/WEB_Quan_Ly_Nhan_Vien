import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Quản lý nhân viên</h2>
      <nav>
        <NavLink to="/attendance" className={({isActive}) => isActive ? "active" : ""}>Chấm công</NavLink>
        <NavLink to="/checkinout" className={({isActive}) => isActive ? "active" : ""}>Check In/Out</NavLink>
        <NavLink to="/salary" className={({isActive}) => isActive ? "active" : ""}>Lương</NavLink>
        <NavLink to="/leave" className={({isActive}) => isActive ? "active" : ""}>Nghỉ phép</NavLink>
        <NavLink to="/leave/request" className={({isActive}) => isActive ? "active" : ""}>Gửi yêu cầu nghỉ</NavLink>
        <NavLink to="/leave/approval" className={({isActive}) => isActive ? "active" : ""}>Duyệt nghỉ</NavLink>
        <NavLink to="/contracts" className={({isActive}) => isActive ? "active" : ""}>Hợp đồng</NavLink>
        <NavLink to="/contracts/add" className={({isActive}) => isActive ? "active" : ""}>Thêm hợp đồng</NavLink>
        <NavLink to="/reports" className={({isActive}) => isActive ? "active" : ""}>Báo cáo</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
