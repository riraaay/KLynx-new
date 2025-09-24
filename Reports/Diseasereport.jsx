import { useEffect, useState } from 'react';
import './DiseaseReport.css';
import Sidebar from '../src/components/sidebar';

import { Line, Bar, Pie } from "react-chartjs-2";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import 'chart.js/auto'; // Import chart.js to enable chart rendering

// Generate Disease PDF Report
import { generatePDF } from '../Utility/D Report PDF';

// Mocking API responses for disease statistics
const mock = new MockAdapter(axios);
const currentYear = new Date().getFullYear();


// Delete when the real data is available
const today = new Date();
const formattedDate = today.toLocaleDateString('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
const sampleData = [
  {
    "Disease": "Influenza",
    "Total of Cases": 152,
    "New Cases": 12,
    "Date": today,
    "Common Street": "Kagandahan St.",
  },
  {
    "Disease": "Dengue",
    "Total of Cases": 87,
    "New Cases": 5,
    "Date": today,
    "Common Street": "Zone 3",
  },
  {
    "Disease": "Tuberculosis",
    "Total of Cases": 45,
    "New Cases": 1,
    "Date": today,
    "Common Street": "Karangalan St.",
  }
];

mock.onGet('/api/disease-statistics').reply(200, {
    "January": 300,
    "February": 250,
    "March": 100,
    "April": 50,
   "May" : 250,
    "June" : 150,
    "July" : 100,
    "August" : 160,
   "September" : 50,
    "October" : 10,
    "November" : 20,
    "December" : 30
  });

// Download PDF function
const handleDiseaseDownload = async () => {
  try {

    /* For real-time data, uncomment the following lines:
    // Fetch real-time data from the API

    const response = await fetch('/api/get_disease_report.php');
    const data = await response.json(); */


const simulatedData = [
  { disease_name: 'Dengue', count: 24, severity: 'High' },
  { disease_name: 'Influenza', count: 15, severity: 'Moderate' },
  { disease_name: 'Tuberculosis', count: 5, severity: 'Low' },
  { disease_name: 'Leptospirosis', count: 8, severity: 'Moderate' },
  { disease_name: 'Measles', count: 12, severity: 'High' },
  { disease_name: 'Chickenpox', count: 7, severity: 'Low' },
  { disease_name: 'COVID-19', count: 20, severity: 'High' },
  { disease_name: 'Malaria', count: 3, severity: 'Low' },
  { disease_name: 'Hepatitis', count: 6, severity: 'Moderate' },
  { disease_name: 'Cholera', count: 2, severity: 'High' },
  { disease_name: 'Rabies', count: 4, severity: 'High' },
  { disease_name: 'Typhoid Fever', count: 9, severity: 'Moderate' },
  { disease_name: 'Polio', count: 1, severity: 'High' },
  { disease_name: 'Mumps', count: 5, severity: 'Low' },
  { disease_name: 'Scarlet Fever', count: 2, severity: 'Moderate' },
];


    const headers = ['Disease Name', 'Cases', 'Severity'];
    const rows = /*PHPdata*/simulatedData.map(item => [
      item.disease_name,
      item.count,
      item.severity || 'N/A'
    ]);

    // 🕒 Get current month and year in Philippine Time
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long'
    });

    generatePDF({
      title: 'Disease Report',
      monthYear: monthYear,
      tableHeaders: headers,
      tableData: rows,
      logo: 'src/assets/picture/medikablue.png',
    });
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    alert('Could not generate real-time report.');
  }
};



function DiseaseReport() {

 const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [mockData, setMockData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
/*
  const [PHPdata, setPHPData] = useState([]);

  useEffect(() => 
  {
    // Replace with actual API endpoint
    fetch('/api/get_disease_report.php')
      .then(res => res.json())
      .then(setPHPData)
      .catch(console.error);
  }, []);

*/

  const itemsPerPage = 8;

  // const [data, setData] = useState([]);

   //set active modal 
    //  const [activeTab, setActiveTab] = useState('');



const [generalDetails, setGeneralDetails] = useState({
    name: '',
    username: '',
    contact: '',
    password: ''
});


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


  const handleSave = () => {
    // Save the updated details to local storage
    localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
    alert('Account details saved successfully!');
    setShowManageAccount(false);
  };


  // Pagination
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mockData.slice(startIndex, startIndex + itemsPerPage);
  

   // Admin Account Management
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminAccounts, setAdminAccounts] = useState([]);

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

const DATA = {
  summary: {
    year2025: { rate: 11.2, leadingDisease: 'Flu' },
    year2024: { rate: 10.5 },
  },
  monthlyChart: [10, 15, 20, 25, 30],
  yearlyChart: [5, 10, 20, 15, 25, 30, 35, 15, 20, 25, 30, 40]
};

const labels = ["Flu", "Diarrhea", "HIV", "Leptospirosis", "Common Cold"];

const data = {
  labels: labels,
  datasets: [
    { label: "Disease Cases",
      backgroundColor: "#42A5F5",
      borderColor: "#42A5F5",
      data: [10, 20, 30,  40, 50],
    },
  ],
};

const LineChart = () => {
  return (
    <div>
      <Line data={data} />
    </div>
  );
};

//Bar Chart
const [diseaseStats, setdiseaseStats] = useState([]);
const [communicableStats, setCommunicableStats] = useState([]);
const [acuteStats, setAcuteStats] = useState([]);
const [ageStats, setAgeStats] = useState([]);
const [nonCommunicableStats, setNonCommunicableStats] = useState([]);
const [chronicStats, setChronicStats] = useState([]);
const [sexStats, setSexStats] = useState([]);   

useEffect(() => {
    // Fetch data from mock APIs
    const fetchData = async () => {
      try {
       
        const statsResponse = await axios.get('/api/disease-statistics');
        setdiseaseStats(statsResponse.data);
        const communicableResponse = await axios.get('/api/Communicable');
        setCommunicableStats(communicableResponse.data);
        const acuteResponse = await axios.get('/api/Acute');
        setAcuteStats(acuteResponse.data);
        const ageResponse = await axios.get('/api/Age');
        setAgeStats(ageResponse.data);
        const nonCommunicableResponse = await axios.get('/api/noncommunicable');
        setNonCommunicableStats(nonCommunicableResponse.data);      
        const chronicResponse = await axios.get('/api/chronic');
        setChronicStats(chronicResponse.data);
        const sexResponse = await axios.get('/api/sex');
        setSexStats(sexResponse.data);

      } 
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

     fetchData();
  }, []);

const diseaseChartData = {
  
    labels: Object.keys(diseaseStats),
    datasets: [
        {
                label: 'Number of Cases',
                fill: false,
                data: Object.values(diseaseStats),
                backgroundColor: "#42A5F5",
                borderColor: "#42A5F5",
                borderWidth: 2,
              },
            ],
          };

          const diseaseChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: '',
              },
            },
          };

return (

    <div className='container'>

        <div className="navbar">
        <Sidebar />
      </div>

      <div className='main'>
        
        <div className="header">
          <h2>
            Disease Report  
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

          <button className='download'onClick={handleDiseaseDownload}>Download Disease Report</button>


        </div>

        <div className='container'>
            <div className='stat-card'>

                <h2>{currentYear} Disease Chart</h2>
                <div className='chart-container'>

                     <Bar data={diseaseChartData} options={diseaseChartOptions} />
                </div>

            </div>


        </div>


        <div className='contents'>

            
            <div className='stat-card'>

                <h1>Disease Summary Table</h1>

            </div>

            <div className='table-container'>
                <table className='table-cont'>
                    <thead>
                        <tr>
                            <th>Disease Names</th>
                            <th>Total of Cases</th>
                            <th>New Case (as per {formattedDate})</th>
                            <th>Common Street</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/*currentData*/sampleData.map((record, index) => (
                            <tr key={index}>
                                <td>{record["Disease"]}</td>
                                <td>{record["Total of Cases"]}</td>
                                <td>{record["New Cases"]}</td>
                                <td>{record["Common Street"]}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>                    
            </div>
             
        </div>
  


    </div>
    </div>

)}

export default DiseaseReport;   