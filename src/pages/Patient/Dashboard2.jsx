import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import medikaLogo from '../../assets/picture/medikawhite.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Dashboard2.css";

/*import DiseaseStatisticsChart from "./DiseaseStatisticsChart";*/

const Dashboard2 = () => {
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

  
  const navigate = useNavigate();
  const handleGeoMapNavigation = () => {
    navigate("/geomap");
  };

  {/* For logout, no function
  const handleLogout = () => {
    navigate("/App.jsx");
  }; */}

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const computeBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters && weightInKg) {
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return "Invalid input";
  };
  /*new*/
  const [temperature, setTemperature] = useState('');
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    const temp = e.target.value;
    setTemperature(temp);

    // Determine status based on input
    if (temp === '') {
      setStatus('');
    } else if (isNaN(temp)) {
      setStatus('Invalid Input');
    } else if (temp < 36) {
      setStatus('Hypothermia');
    } else if (temp <= 37.5) {
      setStatus('Normal');
    } else {
      setStatus('Fever');
    }
  };
  const [bpUpper, setBpUpper] = useState("");
  const [bpLower, setBpLower] = useState("");
  const [result, setResult] = useState("");

  const checkHeartRate = () => {
    const upper = parseInt(bpUpper, 10);
    const lower = parseInt(bpLower, 10);

    if (isNaN(upper) || isNaN(lower)) {
      setResult("Please enter valid numbers for both values.");
      return;
    }

    if (upper < 120 && lower < 80) {
      setResult("Normal");
    } else if (upper >= 120 && upper <= 129 && lower < 80) {
      setResult("Elevated");
    } else if ((upper >= 130 && upper <= 139) || (lower >= 80 && lower <= 89)) {
      setResult("Hypertension Stage 1");
    } else if (upper >= 140 || lower >= 90) {
      setResult("Hypertension Stage 2");
    } else if (upper > 180 && lower > 120) {
      setResult("Hypertensive Crisis - Seek immediate medical attention!");
    } else {
      setResult("Unable to classify.");
    }
  };

{/*===============================================*/}
  return (
    <div className="dashboard-container">
      <aside className={`dashboard-sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <nav>
          <ul>
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
          <span className="dashboard-header-text">Dashboard</span>
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

    <div className="dashboard-container1">
    <div className="dashboard-stat-card">
      <h3>Top 10 Diseases</h3>
      <div className="dashboard-list-placeholder">List goes here</div>
      <button className="dashboard-buton" onClick={handleGeoMapNavigation}>
        More
      </button>
    </div>
      
      <div className="dashboard-stat-card">
        <h3>Body Temperature</h3>{/*new*/}
        <input
        type="text"
        placeholder="Enter your Temperature"
        className="dashboard-temperature"
        value={temperature}
        onChange={handleInputChange}
      />
       <div style={styles.status}>{status}</div>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Heart Rate</h3>{/*new*/}
        <input
        type="number"
        placeholder="Enter BP Upper Number"
        className="dashboard-heartrate"
        value={bpUpper}
        onChange={(e) => setBpUpper(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Enter BP Lower Number"
        className="dashboard-heartrate"
        value={bpLower}
        onChange={(e) => setBpLower(e.target.value)}
        style={styles.input}
      />
      <button onClick={checkHeartRate} style={styles.button}>
        Check
      </button>
      {result && <p style={styles.result}>{result}</p>}
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Today&#39;s Appointment</h3>
        <div className="dashboard-treatment">Treatment</div>
        <div className="dashboard-treatment">Treatment</div>
          <button className="dashboard-buton">More</button>
      </div>
    </div>
    <div className="dashboard-container2">
      <div className="dashboard-analytics">
        <h3>Disease Statistics</h3>
        {/*<DiseaseStatisticsChart />*/}
      </div>
      <div className="dashboard-bmi">
        <h3>B.M.I</h3>
        <p>Height:</p>
        <input
          type="text"
          id="height"
          className="dashboard-height-placeholder"
          placeholder="Enter your height (cm)"
          value={height}
          onChange={handleHeightChange}
          required
        />
        <p>Weight:</p>
        <input
          type="text"
          id="weight"
          className="dashboard-weight-placeholder"
          placeholder="Enter your weight (kg)"
          value={weight}
          onChange={handleWeightChange}
          required
        />
        <p>B.M.I</p>
        <div className="dashboard-bmi-placeholder">{computeBMI()}</div>
      </div>
    </div>
    <div className="dashboard-container3">
      <div className="dashboard-Prescription">
        <h3>Doctor&#39;s Prescription</h3>
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Doctor&#39;s Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Medicine Name</td>
              <td>Medicine Dosage</td>
              <td>Medicine Frequency</td>
              <td>Doctor&#39;s Name</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="dashboard-notes">
        <h3>Doctor&#39;s Note</h3>
        <div className="dashboard-note-placeholder">Note goes here</div>
      </div>
    </div>
      </main>
    </div>
  );
};
/*new*/
const styles = {
  status: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#1114a3",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "5px 5px",
    cursor: "pointer",
    marginTop: "10px",
    width: "30%",
  },
}

export default Dashboard2;
