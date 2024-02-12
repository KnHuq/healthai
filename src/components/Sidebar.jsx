import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./CustomSidebar.css"; // Ensure updated styles are applied
import { useNavigate } from "react-router-dom";

const CustomSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Manage collapsed state
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      className={`custom-sidebar ${
        isCollapsed ? "collapsed" : ""
      } bg-dark text-white`}
    >
      <div
        className="sidebar-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="icon-text-wrapper">
          <i className="fas fa-bars fa-lg" style={{ marginRight: "10px" }}></i>{" "}
          {/* Icon always visible */}
          {!isCollapsed && <span className="header-text">HealthAI</span>}{" "}
          {/* Text hidden on collapse */}
        </span>
      </div>

      <ul className="sidebar-nav">
        {/* Navigation Links */}
        <li>
          <NavLink to="/welcome" activeClassName="active">
            <i className="fas fa-home"></i>
            {!isCollapsed && <span> Home</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-auth" activeClassName="active">
            <i className="fas fa-user-shield"></i>
            {!isCollapsed && <span> Admin</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" activeClassName="active">
            <i className="fas fa-user-plus"></i>
            {!isCollapsed && <span> Register</span>}
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && <span> Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default CustomSidebar;
