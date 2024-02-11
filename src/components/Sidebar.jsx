import React from 'react';
import { NavLink } from 'react-router-dom';
import './CustomSidebar.css'; // Assuming you will create a separate CSS file for the sidebar

const CustomSidebar = () => {
  return (
    <div className="custom-sidebar bg-dark text-white">
      <div className="sidebar-header">
        <h2 className="text-white my-5 mx-auto">HealthAI</h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/welcome" activeClassName="active">Home</NavLink>
        </li>
        <li>
          <NavLink to="/admin-auth" activeClassName="active">Admin</NavLink>
        </li>
        <li>
          <NavLink to="/register" activeClassName="active">Register</NavLink>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </div>
  );
};

export default CustomSidebar;
