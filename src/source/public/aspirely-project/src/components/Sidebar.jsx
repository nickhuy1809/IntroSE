import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../img/HomeIcon.svg'; // Đảm bảo Icon.svg nằm trong src/assets

export default function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <HomeIcon style={{ marginRight: 12 }} />
        Home
      </NavLink>
      <NavLink
        to="/schedule"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        Schedule
      </NavLink>
      {/* Thêm các mục khác nếu cần */}
    </div>
  );
}