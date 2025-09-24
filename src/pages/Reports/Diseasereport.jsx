import { useEffect, useState } from 'react';
import './DiseaseReport.css';
import Sidebar from '../../components/Sidebar';
import { Line, Bar, Pie } from "react-chartjs-2";
import axios from 'axios';
import 'chart.js/auto'; // Import chart.js to enable chart rendering

// Generate Disease PDF Report
import { generatePDF } from './D Report PDF';

// Dates Application
const currentYear = new Date().getFullYear();
const today = new Date();

const formattedDate = today.toLocaleDateString('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const currentMonth = today.toLocaleString("en-PH", {
  timeZone: 'Asia/Manila',
  month: "long",
  year: "numeric",
});

const allMonths = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, '0');
  return `${currentYear}-${month}`;
});


// Convert current date to ISO format for backend compatibility
const todayISO = new Date().toISOString(); // e.g. "2025-08-02T02:00:00.000Z"
const dateParam = todayISO.split('T')[0]; // "2025-08-02"
const monthParam = dateParam.slice(0, 7);  // "2025-08"



function DiseaseReport() {
  // State for managing notifications, settings, and account management
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // State for storing health data
  const [HealthData, setHealthData] = useState([]);
  const [diseaseStats, setDiseaseStats] = useState([]);

    // Pagination based on real HealthData
  const itemsPerPage = 8;
  const totalPages = Math.ceil(HealthData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = HealthData.slice(startIndex, startIndex + itemsPerPage);
  
   // Admin Account Management
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminAccounts, setAdminAccounts] = useState([]);


const handleDiseaseDownload = async () => {
  try {
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long'
    });

    // Use real-time data from HealthData state
    const rows = HealthData.map(item => {
      const age0_17 = Number(item['Age 0-17']) || 0;
      const age18_40 = Number(item['Age 18-40']) || 0;
      const age41_59 = Number(item['Age 41-59']) || 0;
      const age60plus = Number(item['Age 60+']) || 0;
      const total = age0_17 + age18_40 + age41_59 + age60plus;

      return [
        item["DiagnosisName"],  // Make sure the key matches your API
        age0_17,
        age18_40,
        age41_59,
        age60plus,
        total
      ];
    });

    const headers = [
      'Diagnosis Name',
      'Age [0–17]',
      'Age [18–40]',
      'Age [41–59]',
      'Age [60+]',
      'Total Cases'
    ];

    generatePDF({
      title: 'Medical Report',
      monthYear: monthYear,
      tableHeaders: headers,
      tableData: rows,
      logo: 'src/assets/picture/medikablue.png',
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Could not generate report.');
  }
};

const [generalDetails, setGeneralDetails] = useState({
    name: '',
    username: '',
    contact: '',
    password: ''
});


// Getting Real-time Data from PHP
useEffect(() => {
  const fetchData = async () => {
    try {
      // Get today's date in backend-compatible format
      const today = new Date();
      const dateParam = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const monthParam = dateParam.slice(0, 7);             // 'YYYY-MM'

      // Call your PHP endpoint with query parameters
      const response = await fetch(`http://localhost/api/fetchHealthReport.php?date=${dateParam}&month=${monthParam}`);
      const data = await response.json();
      setHealthData(data);
    } catch (error) {
      console.error('Error fetching health report:', error);
    }
  };

  fetchData();
}, []);


 useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('accountDetails'));
    if (savedDetails) {
        setGeneralDetails(savedDetails);
    }
}, []);

  // Handle input changes for account management
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value
    }));
  };

// Save account details to local storage
  const handleSave = () => {
    // Save the updated details to local storage
    localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
    alert('Account details saved successfully!');
    setShowManageAccount(false);
  };

  // Fetching Disease Statistics
  const HandleAddAdmin = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost/OneCaintaRecord/insertAdminAccount.php', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.text();
        console.log(result);
        // Optionally, update the adminAccounts state to reflect the new admin account
        setAdminAccounts([...adminAccounts, { fullName, username }]);
        // Clear the form fields
        setFullName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        console.error('Failed to add admin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


//Disease  Reports
//Bar Chart
useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get('http://localhost/api/disease-statistics.php');
        setDiseaseStats(statsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const chartData = {
  labels: allMonths.map(monthKey =>
    new Date(`${monthKey}-01`).toLocaleDateString("en-PH", {
      month: "long",
      year: "numeric"
    })
  ),
  datasets: [
    {
      label: 'Number of Cases',
      data: allMonths.map(monthKey => diseaseStats[monthKey] || 0),
      backgroundColor: "#fff349ff",
      borderColor: "#000000ff",
      borderWidth: 2,
    }
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#ffffffff', // Legend label color
      }
    },
    title: {
      display: true,
      text: 'Monthly Total Diagnoses',
      color: "#ffffffff", // Title color
      font: {
        size: 18,
        weight: 'bold',
      }
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#fff349ff", // X-axis month labels
      }
    },
    y: {
      ticks: {
        color: "#fff349ff", // Y-axis number labels
      }
    },
  }
};

return (

    <div className='container'>

        <div className="navbar">
        <Sidebar />
      </div>

      <div className='main'>
        
        <div className="header">
          <h2>
            Medical Report
          </h2>

          <div className="icon">
          <div className="icon">
           <i
              className="fas fa-bell"
              id="notif"
              onClick={() => setShowNotifications(!showNotifications)}
            ></i>
            <i
              className="fas fa-cog"
              id="settings"
              onClick={() => setShowSettings(!showSettings)}
            ></i>
          </div>

          {showNotifications && (
            <div className="dropdown notifications-dropdown">
              <ul>
                <li>New disease alert: Dengue</li>
                <li>System maintenance scheduled</li>
                <li>Weekly report available</li>
              </ul>
            </div>
          )}
          {showSettings && (
            <div className="dropdown settings-dropdown">
              <ul>
                <li onClick={() => setShowManageAccount(true)}>Manage Account</li>
                <li onClick={() => setShowTerms(true)}>Terms and Condition</li>
                <li onClick={() => setShowAddAdmin(true)}>Add Admin Account</li>
              </ul>
            </div>
          )}
          </div>
        </div>

           <div className='container-patient'>
          {showManageAccount && (
                       <div className="modal-patient">
                       <div className="modal-content-patient">
                           <h2>Manage Account</h2>
                           <button className="close" onClick={() => setShowManageAccount(false)}>
                               &times;
                           </button>
                           <div className="modal-section-patient">
                               <h3>General Details</h3>
                               <form>
                                   <label>
                                       Complete Name:
                                       <input
                                           type="text"
                                           name="name"
                                           value={generalDetails.name}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Username:
                                       <input
                                           type="text"
                                           name="username"
                                           value={generalDetails.username}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Contact NO.:
                                       <input
                                           type="text"
                                           name="contact"
                                           value={generalDetails.contact}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Password:
                                       <input
                                           type="password"
                                           name="password"
                                           value={generalDetails.password}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                               </form>
                                <button className="cancel" onClick={() => setShowManageAccount(false)}>Cancel</button>
                               <button className="save" onClick={handleSave}>Save Changes</button>
                           </div>
                       </div>
                   </div>
      )}

      {showAddAdmin && (
        <div className="modal-patient">
          <div className="modal-content-patient">

            <h3>Add Admin Account</h3>
                <button className="close"
                  onClick={() => setShowAddAdmin(false)}
                >
                  &times;
                </button>
          <div className="modal-section-patient">

            <input 
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="Full Name"
             required 
            />

            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 

             />
            <button onClick={HandleAddAdmin}>Add Admin</button>

            {/* Sample output para makita if nag sasave yung admin account
            <h3>Admin Accounts(Sample lang to check if nag aadd)</h3>
            <ul>
                {adminAccounts.map((account, index) => (
                    <li key={index}>{account.username}</li>
                ))}
            </ul> */}


              </div>

              </div>
            </div>
            )}  

      {showTerms && (
            <div className="modal-patient">
              <div className="modal-content-patient">
                <h2>Terms & Conditions</h2>
                <button className="close"
                  onClick={() => setShowTerms(false)}
                >
                  &times;
                </button>
                <div className="modal-section">
                  <p>
                    By using this system, you agree to our terms and conditions...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='contents'>

          <button className='download'onClick={handleDiseaseDownload}>Download Medical Report</button>


        </div>

        <div className='container'>
            <div className='stat-card'>

                <h2>{currentYear} Medical Chart</h2>
                <div className='chart-container'>
                        {Object.keys(diseaseStats).length === 0 ? (
                          <p>No data available for this year.</p>
                        ) : (
                          <Bar data={chartData} options={chartOptions} />
                        )}
                </div>

            </div>


        </div>


        <div className='contents'>

            
            <div className='stat-card'>

                <h1>Medical Summary Table</h1>

            </div>

            <div className='table-container'>
                <table className='table-cont'>
                    <thead>
                        <tr>
                            <th>Diagnosis Names</th>
                            <th>Age 0-17</th>
                            <th>Age 18-40</th>
                            <th>Age 41-59</th>
                            <th>Age 60+</th>
                            <th>New Case (as per {formattedDate})</th>
                            <th>Total of Cases (as per {currentMonth})</th>
                        </tr>
                    </thead>

                        <tbody>
                          {HealthData.map((record, index) => {
                            // Convert age group values to numbers and sum them
                            const age0_17 = Number(record["Age 0-17"]) || 0;
                            const age18_40 = Number(record["Age 18-40"]) || 0;
                            const age41_59 = Number(record["Age 41-59"]) || 0;
                            const age60plus = Number(record["Age 60+"]) || 0;
                            const overallTotal = age0_17 + age18_40 + age41_59 + age60plus;

                            return (
                              <tr key={index}>
                                <td>{record["DiagnosisName"]}</td>
                                <td>{record["Age 0-17"]}</td>
                                <td>{record["Age 18-40"]}</td>
                                <td>{record["Age 41-59"]}</td>
                                <td>{record["Age 60+"]}</td>
                                <td>{record["New Cases"]}</td>
                                <td>{overallTotal}</td> {/* Show the overall total */}
                              </tr>
                            );
                          })}
                  </tbody>
                </table>                    
            </div>
             
        </div>
  


    </div>
    </div>

)}

export default DiseaseReport;   