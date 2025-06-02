import { useState } from "react";
import { Link } from "react-router-dom";
import medikaLogo from "../../assets/picture/medikawhite.svg"; // Replace with the correct path to your logo

const DashboardSidebar = () => {
  // State to manage sidebar expansion
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  // Function to toggle the sidebar
  const handleSidebarToggle = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="dashboard-container">
      <aside className={`dashboard-sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <nav>
          <ul>
            {/* Sidebar header with logo and toggle button */}
            <li className="sidebar-header">
              <img src={medikaLogo} alt="Medika Logo" className="dashboard-sidebar-logo" />
              <button id="toggle-btn" onClick={handleSidebarToggle}>
                {isSidebarExpanded ? (
                  <i className="fa-solid fa-angles-left"></i>
                ) : (
                  <i className="fa-solid fa-angles-right"></i>
                )}
              </button>
            </li>
            {/* Navigation Links */}
            <li>
              <Link to="/patient-dashboard">
                <i className="fas fa-tachometer-alt fa-1x"></i>
                {isSidebarExpanded && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link to="/appointment">
                <i className="fas fa-calendar-alt fa-1x"></i>
                {isSidebarExpanded && "Appointment"}
              </Link>
            </li>
            <li>
              <Link to="/patient-record">
                <i className="fas fa-file-medical-alt fa-1x"></i>
                {isSidebarExpanded && "Patient Record"}
              </Link>
            </li>
            <li>
              <Link to="/geomap">
                <i className="fa-solid fa-map"></i>
                {isSidebarExpanded && "GeoMap"}
              </Link>
            </li>
          </ul>
          {/* Logout Button */}
          <li>
              <Link to="/home">
                <i className="fa-solid fa-map"></i>
              {isSidebarExpanded && "Logout"}
              </Link>
            </li>
          
        </nav>
      </aside>




      
    </div>
  );
};

export default DashboardSidebar;
