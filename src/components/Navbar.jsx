import { useState } from 'react'
import SidebarOKBC from '../assets/picture/medikawhite.svg'
import './Navbar.css';


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
              <a href="/Dashboard">

              {!isCollapsed && <span>Dashboard</span>}
              </a>
              </li>
              <li>
                <a href="/Maps">

                {!isCollapsed && <span>GeoMap</span>}
                </a>
              </li>
          </ul>
      </div>
      <div className="menu-item">
        <ul> <h3>File Maintenance</h3>
          <li> 
            <a href="/patientPage">
            {!isCollapsed && <span>Patient</span>}
            </a>
          </li>
          <li>
            <a href="/staffPage">
            {!isCollapsed && <span>Staff</span>}
            </a>
          </li>
          <li>
            <a href="/">
            {!isCollapsed && <span>Doctors</span>}
            </a>
          </li>
          <li>
            <a href="/">
            {!isCollapsed && <span>Nurse</span>}
            </a>
          </li>
          <li>
            <a href="/Consultation">
            {!isCollapsed && <span>Patient Consultation</span>}
            </a>
          </li>
          <li>
            <a href="/Prenatal">
            {!isCollapsed && <span>Prenatal</span>}
            </a>
          </li>
          <li>
            <a href="/">
            {!isCollapsed && <span>Animal Bite Incident</span>}
            </a>
          </li>
        </ul>
      </div>
      <div className="menu-item">
        <ul> <h3>Reports</h3>
          <li>
            <a href="/Patientrecord">
            {!isCollapsed && <span>Patient Record</span>}
            </a>
          </li>
          <li>
            <a href="/">
            {!isCollapsed && <span>Disease Report</span>}
            </a>
          </li>
          <li>
            <a href="/">
            {!isCollapsed && <span>Animal Bite Incident Report</span>}
            </a>
          </li>
          <li>
            <a href="/">
            {!isCollapsed && <span>FHSIS Report</span>}
            </a>
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