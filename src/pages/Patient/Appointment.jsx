import { useState } from "react";
import { Link } from "react-router-dom";
import medikaLogo from '../../assets/picture/medikawhite.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Appointment.css";

const   Appointment = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

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
//  const closeModal = () => setActiveModal(null);


  
  const data = [
    {
      familyId: '12345',
      patientName: 'John Doe',
      treatment: 'Check-up',
      date: '2023-12-15',
      result: 'Normal',
      doctorName: 'Dr. Smith',
    },
    // Add more data objects as needed
  ];

  const handleDateChange = (e) => {
    const inputDate = new Date(e.target.value);
    const day = inputDate.getDay();
  
    // If the selected day is Saturday (6) or Sunday (0), clear the input
    if (day === 0 || day === 6) {
      alert("Please select a weekday (Monday to Friday).");
      e.target.value = ""; // Clear the invalid date
    }
  };
  
  
  return (
      <div className="appointment-container">
        <aside className={`appointment-sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <nav>
          <ul>
            <li className="sidebar-header">
              <img src={medikaLogo} alt="Medika Logo" className="appointment-sidebar-logo" />
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

        <main className="appointment-main-content">
      <header className="dashboard-header">
      <span className="dashboard-header-text">Appointments</span>
      <div className="dashboard-header-icons">
        <button onClick={handleOpenBellPopup}>
          <i className="fas fa-bell"></i>
        </button>
        <button onClick={handleOpenCogPopup}>
          <i className="fas fa-cog"></i>
        </button>

        {/* Cog Popup */}
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
                    Starts at Monday 9:00 A.M. Please Bring any ID htmlFor verification
                  </p>
                </div>
              )}
              {activeModal === "general" && (
                <div>
                  <h3 className="dashboard-settings-tc">BAKUNA NOTICE</h3>
                  <p className="dashboard-settings-tc">
                  Free Vaccination htmlFor Anti-Rabis. Please be reminded that the center will cater htmlFor 50 people only
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
                  the proper and secure operation of the platform htmlFor all users
                  Access to the EHR system is restricted to authorized users, 
                  including health center staff, administrators, and other approved personnel.
                  Users must register htmlFor access and comply with verification processes.
                </p>
                <p className="dashboard-settings-tc">
                  Users must ensure login credentials are secure and not shared with others.
                  Users must also use the system only htmlFor authorized medical and administrative purposes.
                  The health center reserves the right to suspend or terminate user accounts 
                  htmlFor violations of these T&Cs, including unauthorized data access or misuse of the system.
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
                  A: The EHR system is a digital platform htmlFor managing patient records, appointments, and clinical workflows. 
                  It improves efficiency, reduces paperwork, and ensures secure storage of health information.
                </p>
                <h3 className="dashboard-settings-tc">
                  Q: Who can use the EHR system?
                  </h3>
                <p className="dashboard-settings-tc">
                  A: The EHR system is designed htmlFor authorized health center staff, including doctors, nurses, 
                  and administrative personnel. Access is restricted based on roles and responsibilities.
                </p>
              </div>
            )}
            </div>
          </div>
          
        )}            

      </div>
    </header>
    <div className="appointment-appcontainer">
      <div className="appointment-text">
        <h1>Appointment Details</h1>
      </div>
    </div>

    {/* CHANGED THIS ONE INCASE I COMMENTED*/}
    <div className="appointment-container1">
            <div className="appointment-app-details">
                <div className="appointment-app-item">
                    <p>Family ID:</p>
                    <div id="displayFamilyID" className="appointment-appcon-placeholder">Display Family ID</div>
                </div>
                <div className="appointment-app-item">
                    <p>Patient Name:</p>
                    <div id="displayPatientName" className="appointment-appcon-placeholder">Display Patient Name</div>
                </div>
                <div className="appointment-app-item">
                    <p>Contact No.:</p>
                    <div id="displayContactNo" className="appointment-appcon-placeholder">Display Contact No.</div>
                </div>
                <div className="appointment-app-item">
                    <p>Email Address:</p>
                    <div id="displayEmail" className="appointment-appcon-placeholder">Display Email Address</div>
                </div>
                <div className="appointment-app-item">
                    <p>Time and Date:</p>
                    <div id="displayTimeDate" className="appointment-appcon-placeholder">Display Time and Date</div>
                </div>
                <button className="appointment-submit-btn" /*onClick={handlesubmitForm}*/>Book Now</button>
            </div>

            <div className="appointment-appointment-details">
                <p>Family ID</p>
                <input id="familyID" type="appointment-text" className="appointment-appdeets" placeholder="Family ID" required/>
                
                <p>Patient Name</p>
                <input id="patientName" type="appointment-text" className="appointment-appdeets" placeholder="Patient Name" required/>
                
                <p>Contact No.</p>
                <input id="contactNo" type="appointment-text" className="appointment-appdeets" placeholder="Contact No" required/>
                
                <p>Email Address</p>
                <input id="email" type="appointment-text" className="appointment-appdeets" placeholder="Email Address" required/>
            </div>

            <div className="appointment-service-time-date">
                <div className="appointment-type-selector">
                    <span>Service</span>
                    <div className="labels">
                        <label><input type="radio" className="treatment-type" value="consultation" name="service"/> Consultation</label>
                        <label><input type="radio" className="treatment-type" value="dental" name="service"/> Dental</label>
                        <label><input type="radio" className="treatment-type" value="vaccine" name="service"/> Vaccine</label>
                    </div>
                </div>

               <div className="appointment-time-selector">
                    <label htmlFor="time">Select Time:</label>
                    <input type="time" id="time" name="time" min="09:00" max="17:00" />
                </div>
                <div className="appointment-date-selector">
                    <label htmlFor="date">Select Date:</label>
                    <input type="date" id="date" name="date" onChange={(e) => handleDateChange(e)}/>
                </div> 
            </div>
    </div>
    <div className="appointment-appcontainer">
            <div className="appointment-text1">
                <h1>Appointment History</h1>
            </div>
    </div>
    <div className="appointment-container2">
      <div className="appointment-history">
        <table>
          <thead>
            <tr>
              <th>Family ID</th>
              <th>Patient Name</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Result</th>
               <th>Doctor&#39;s Name</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.familyId}</td>
              <td>{item.patientName}</td>
              <td>{item.treatment}</td>
              <td>{item.date}</td>
              <td>{item.result}</td>
              <td>{item.doctorName}</td>
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



export default Appointment;
