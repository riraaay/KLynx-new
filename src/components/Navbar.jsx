import { useState } from 'react'
import SidebarOKBC from '../assets/picture/medikawhite.svg'
import './Navbar.css';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (

    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
      {isCollapsed ? <i className="fa-solid fa-angles-left"></i>  : <i className="fa-solid fa-angles-right"></i>}
     </button>  
      <img src={SidebarOKBC} className="logo" alt="logo"/>
    <div className="icon-container"> 
      <div className="menu-item">
          <ul>
           <h3>Main</h3>
              <li> 
              <Link to="/Dashboard">
              
              {!isCollapsed && <span>Dashboard</span>}
              </Link>
              </li>
              <li>
                <Link to="/Maps">
             
                {!isCollapsed && <span>GeoMap</span>}
                </Link>
              </li>
          </ul>
      </div>
      <div className="menu-item">
        <ul> <h3>File Maintenance</h3>
          <li> 
            <Link to="/Patientrecord">
            {!isCollapsed && <span>Patient</span>}
            </Link>
          </li>
          <li>
            <Link to="/Staff">
            {!isCollapsed && <span>Staff</span>}
            </Link>
          </li>
          <li>
            <Link to="/Doctors">
            {!isCollapsed && <span>Doctors</span>}
            </Link>
          </li>
          <li>
            <Link to="/">
            {!isCollapsed && <span>Nurse</span>}
            </Link>
          </li>
          <li>
            <Link to="/Consultation">
            {!isCollapsed && <span>Patient Consultation</span>}
            </Link>
          </li>
          <li>
            <Link to="/Prenatal">
            {!isCollapsed && <span>Prenatal</span>}
            </Link>
          </li>
          <li>
            <Link to="/">
            {!isCollapsed && <span>Animal Bite Incident</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div className="menu-item">
        <ul> <h3>Reports</h3>
          <li>
            <Link to="/Patientrecord">
            {!isCollapsed && <span>Patient Record</span>}
            </Link>
          </li>
          <li>
            <Link to="/">
            {!isCollapsed && <span>Disease Report</span>}
            </Link>
          </li>
          <li>
            <Link to="/">
            {!isCollapsed && <span>Animal Bite Incident Report</span>}
            </Link>
          </li>
          <li>
            <Link to="/">
            {!isCollapsed && <span>FHSIS Report</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div className='logout'>
        <a href="../../Facepage/Frontpage.css"> 
       <div className="logout" id="logout">
        <i className="fa-solid fa-arrow-right-from-bracket"></i> 
        {!isCollapsed && <span>Logout</span>}
      </div>
      </a>
    </div>
    </div>
  </div>
  );
}

export default Sidebar;