
import { useState } from "react";
import { Link } from "react-router-dom";
import medikaLogo from '../../assets/picture/medikawhite.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Patient-Record.css";

const   PatientRecord = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

{/* ========COPIED FROM DASHBOARD=================== */}
  const [isBellPopupVisible, setIsBellPopupVisible] = useState(false);
  const [isCogPopupVisible, setIsCogPopupVisible] = useState(false);

  const handleOpenBellPopup = () => {
    setIsBellPopupVisible(true);
  };
  const handleCloseBellPopup = () => {
    setIsBellPopupVisible(false);
  };
  const handleOpenCogPopup = () => {
    setIsCogPopupVisible(true);
  };
  const handleCloseCogPopup = () => {
    setIsCogPopupVisible(false);
  };

  const [activeModal, setActiveModal] = useState(null);
 // const closeModal = () => setActiveModal(null);
{/* ========COPIED FROM DASHBOARD=================== */}

  const data = [
    {
      familyId: '12345',
      patientId: '021425',
      patientName: 'Mabitado, Rie',
      dateOfBirth: '2003-5-27',
      gender: 'Female',
      contactNo: '09215478014',
      address: 'West Crame',
    },
    // Add more data objects as needed
  ];
  return (
      <div className="patient2-container">
        <aside className={`patient2-sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <nav>
          <ul>
            <li className="patient2-sidebar-header">
              <img src={medikaLogo} alt="Medika Logo" className="patient2-sidebar-logo" />
              <button id="toggle-btn" onClick={handleSidebarToggle}>
                {isSidebarExpanded ? (
                  <i className="fa-solid fa-angles-left"></i>
                ) : (
                  <i className="fa-solid fa-angles-right"></i>
                )}
              </button>
            </li>
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
            <li>
              <Link to="/home">
                <i className="fa-solid fa-map"></i>
              {isSidebarExpanded && "Logout"}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

{/* =========== COPY PASTE FROM DASHBOARD SINCE SIMILAR */}
<main className="dashboard-main-content">
        <header className="dashboard-header">
          <span className="dashboard-header-text">Patient Record</span>
          <div className="dashboard-header-icons">
          <button onClick={handleOpenBellPopup}>
            <i className="fas fa-bell"></i>
        </button>
        <button onClick={handleOpenCogPopup}>
          <i className="fas fa-cog"></i>
        </button>

        {/* Bell Popup */}
        {isBellPopupVisible && (
          <div className="dashboard-popup">
            <div className="dashboard-popup-content">
              <span className="dashboard-close" onClick={handleCloseBellPopup}>
                &times;
              </span>
              <h2>ANNOUNCEMENT</h2>
              <div className="dashboard-button-settings">
                <button onClick={() => setActiveModal("all")}>All</button>
                <button onClick={() => setActiveModal("general")}>General</button>
                <button onClick={() => setActiveModal("important")}>Important</button>
              </div>
              {activeModal === "all" && (
                <div>
                  <h3 className="dashboard-settings-tc">LAGNAT NO MORE: BAKUNA NOTICE</h3>
                  <p className="dashboard-settings-tc">
                    Starts at Monday 9:00 A.M. Please Bring any ID for verification
                  </p>
                </div>
              )}
              {activeModal === "general" && (
                <div>
                  <h3 className="dashboard-settings-tc">BAKUNA NOTICE</h3>
                  <p className="dashboard-settings-tc">
                  Free Vaccination for Anti-Rabis. Please be reminded that the center will cater for 50 people only
                  </p>
                </div>
              )}
              {activeModal === "important" && (
                <div>
                  <h3 className="dashboard-settings-tc">System Update Notice</h3>
                  <p className="dashboard-settings-tc">
                    Scheduled maintenance will take place on Sunday January 26, 2025, from 9:00 AM to 12:00 NOON. 
                    During this time, the EHR system wil be undergoing evaluation and we hope that it passes
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cog Popup */}
        {isCogPopupVisible && (
          <div className="dashboard-popup">
            <div className="dashboard-popup-content">
              <span className="dashboard-close" onClick={handleCloseCogPopup}>
                &times;
              </span>
              <h2>SETTINGS</h2>
              
              <ul className="dashboard-settings">
              <p>MEDIKA is designed to streamline health center operations and enhance patient care.</p>
              <button onClick={() => setActiveModal("terms")}>Terms and Conditions</button>
              <button onClick={() => setActiveModal("privacy")}>Privacy Policy</button>
              <button onClick={() => setActiveModal("faqs")}>FAQ&#39;s</button>
              </ul>
              
              {/*terms and condition*/}
              {activeModal === "terms" && (
              <div>
                <h2>Terms and Conditions</h2>
                <p className="dashboard-settings-tc">
                  By accessing and using the Electronic Health Records (EHR) system, 
                  you agree to the following terms and conditions that ensure 
                  the proper and secure operation of the platform for all users
                  Access to the EHR system is restricted to authorized users, 
                  including health center staff, administrators, and other approved personnel.
                  Users must register for access and comply with verification processes.
                </p>
                <p className="dashboard-settings-tc">
                  Users must ensure login credentials are secure and not shared with others.
                  Users must also use the system only for authorized medical and administrative purposes.
                  The health center reserves the right to suspend or terminate user accounts 
                  for violations of these T&Cs, including unauthorized data access or misuse of the system.
                </p>
              </div>
            )}
            {/*privacy policy*/}
            {activeModal === "privacy" && (
              <div>
                <h2>Privacy Policy</h2>
                <p className="dashboard-settings-tc">
                  We are committed to protecting your privacy. All data within
                  the EHR system is encrypted and stored securely. Data collected is used to manage patient records, 
                  facilitate healthcare services, ensure system security, and comply with legal requirements.
                </p>
                <p className="dashboard-settings-tc">
                  Patient data is entered by authorized health center staff. 
                  Patients can object to specific uses of their data, such as marketing. 
                  You have the right to access, correct, or request deletion of your data, subject to applicable laws. 
                </p>
                <p className="dashboard-settings-tc">
                  For questions or concerns about this Privacy Policy, email us at karangalancenter2015@yahoo.com
                </p>
              </div>
            )}
            {/*FAQ's*/}
            {activeModal === "faqs" && (
              <div>
                <h2>FAQs</h2>
                <h3 className="dashboard-settings-tc">
                  Q: What is the EHR system, and how does it benefit our health center?
                </h3>
                <p className="dashboard-settings-tc">
                  A: The EHR system is a digital platform for managing patient records, appointments, and clinical workflows. 
                  It improves efficiency, reduces paperwork, and ensures secure storage of health information.
                </p>
                <h3 className="dashboard-settings-tc">
                  Q: Who can use the EHR system?
                  </h3>
                <p className="dashboard-settings-tc">
                  A: The EHR system is designed for authorized health center staff, including doctors, nurses, 
                  and administrative personnel. Access is restricted based on roles and responsibilities.
                </p>
              </div>
            )}
            </div>
          </div>
          
        )}
      </div>
    </header>

{/* =========== COPY PASTE FROM DASHBOARD SINCE SIMILAR */}


    <div className="pat2container">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input
          type="text"
          id="searchbar"
          className="patient2-search"
          placeholder="Search"
          required
        />
    </div>
    <div className="container1">
      <div className="patient2-history">
        <table>
          <thead>
            <tr>
              <th>Family ID</th>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Contact No.</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.familyId}</td>
              <td>{item.patientId}</td>
              <td>{item.patientName}</td>
              <td>{item.dateOfBirth}</td>
              <td>{item.gender}</td>
              <td>{item.contactNo}</td>
              <td>{item.address}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      </div>
    </main>
    </div>
  );
};

export default PatientRecord;
