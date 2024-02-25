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
        {/* Toggle button or area to click for collapsing */}
        <h2 className={`sidebar-title ${isCollapsed ? "hidden" : ""}`}>
          DASHBOARD
        </h2>
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
          <NavLink to="/analysis" activeClassName="active">
            <i class="fa fa-line-chart" aria-hidden="true" style={{ marginRight: '10px' }}></i>
            {!isCollapsed && <span> Analysis</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/textinput" activeClassName="active">
            <i className="fa fa-file-text" aria-hidden="true" style={{ marginRight: '10px' }}></i>
            {!isCollapsed && <span> Text Input</span>}
          </NavLink>
        </li>
        
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt" style={{ marginRight: '10px' }}></i>
          {!isCollapsed && <span> Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default CustomSidebar;
