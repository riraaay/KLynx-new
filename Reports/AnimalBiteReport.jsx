import { useEffect, useState } from 'react';
import './AnimalBiteReport.css';
import Sidebar from '../src/components/sidebar.jsx';
import { Line, Bar, Pie } from "react-chartjs-2";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import 'chart.js/auto'; // Import chart.js to enable chart rendering

// Generate Animal Bite PDF Report
import { generatePDF } from '../Utility/AB Report PDF';



const mock = new MockAdapter(axios);
const currentYear = new Date().getFullYear();
const today = new Date();
const formattedDate = today.toLocaleDateString('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const sampleData = [
  {
    "Animal": "Monkey",
    "Total of Cases": 2,
    "New Cases": 0,
    "Date": today,
    "Common Street": "Kagandahan St.",
  },
  {
    "Animal": "Dog",
    "Total of Cases": 47,
    "New Cases": 5,
    "Date": today,
    "Common Street": "Zone 3",
  },
  {
    "Animal": "Cat",
    "Total of Cases": 31,
    "New Cases": 2,
    "Date": today,
    "Common Street": "Karangalan St.",
  }
];

mock.onGet('/api/disease-statistics').reply(200, {
    "January": 100,
    "February": 57,
    "March": 89,
    "April": 10,
   "May" : 67,
    "June" : 144,
    "July" : 18,
    "August" : 166,
   "September" : 67,
    "October" : 18,
    "November" : 25,
    "December" : 32
  });

 

  mock.onGet('/api/Age').reply(200, {
    "0-5": 300,     
    "6-10": 250,
    "11-15": 100,
    "16-20": 160,
    "21-30": 50,
    "31-40": 10,
    "41-50": 20,    
    "51-60": 30,
    });

mock.onGet('/api/sex').reply(200, {
    "Male": 300,
    "Female": 250
});

function AnimalBiteReport() {

 const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [mockData, setMockData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  

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


// Handle Download PDF
const handleBiteDownload = async () => {
  try {

    /* For real-time data, uncomment the following lines:
    // Fetch real-time data from the API

    const response = await fetch('/api/get_disease_report.php');
    const data = await response.json(); */


const simulatedData = [
      { animal_name: 'Dog', cases: 24, commonbite: 'Arm', commonstreet: 'Karangalan St.'},
      { animal_name: 'Cat', cases: 15, commonbite: 'Leg',commonstreet: 'Kasipagan St.'},
      { animal_name: 'Monkey', cases: 17, commonbite: 'Hand',commonstreet: 'Kagandahan St.'},
      { animal_name: 'Hamster', cases: 21, commonbite: 'Thigh',commonstreet: 'Kasiyahan St.'},
      { animal_name: 'Ferrets', cases: 15, commonbite: 'Finger',commonstreet: 'Kalungkutan St.' },
    ];


    const headers = ['Animal Names', 'Total of Cases', 'Common Place of Bite', 'Common Street'];
    const rows = /*data*/simulatedData.map(item => [
      item.animal_name,
      item.cases,
      item.commonbite,
      item.commonstreet || 'N/A',
    ]);

    // 🕒 Get current month and year in Philippine Time
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long'
    });

    generatePDF({
      title: 'Animal Bite Report',
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

//Disease  Reports

const labels = ["Dog Bites", "Cat Bites","Monkey Bites", "Other Animal Bites"];

const data = {
  labels: labels,
  datasets: [
    { label: "Incidents",
      backgroundColor: "#42A5F5",
      borderColor: "#42A5F5",
      data: [10, 20, 5,  40],
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

const [ageStats, setAgeStats] = useState([]);

const [sexStats, setSexStats] = useState([]);   

useEffect(() => {
    // Fetch data from mock APIs
    const fetchData = async () => {
      try {
       
        const statsResponse = await axios.get('/api/disease-statistics');
        setdiseaseStats(statsResponse.data);
       
        const ageResponse = await axios.get('/api/Age');
        setAgeStats(ageResponse.data);
        
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
                label: 'Number of Animal Bites',
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

// Age Distribution Chart

const AgeChartData = {
    labels: Object.keys(ageStats),
    datasets: [
        {
                label: 'Frequency',
                fill: false,
                data: Object.values(diseaseStats),
                backgroundColor: "#42A5F5",
                borderColor: "#42A5F5",
                borderWidth: 2,
              },
            ],
          };

          const ageChartOptions = {
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

//Sex Distribution Chart
const sexChartData = {
    labels: Object.keys(sexStats),
    datasets: [
        {
                label: 'Frequency',
                fill: false,
                data: Object.values(sexStats),
                backgroundColor: ["#42A5F5", "#87CEEB", "#6495ED"],
                borderColor: "#42A5F5",
                borderWidth: 2,
              },
            ],
          };

          const sexChartOptions = {
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
            Animal Bite Incident Report
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

            <button className='download'onClick={handleBiteDownload}>Download Bite Report</button>

        </div>


        <div className='container'>
            <div className='stat-card'>

                <h2>{currentYear} Animal Bite Chart</h2>
                <div className='chart-container'>

                     <Bar data={diseaseChartData} options={diseaseChartOptions} />
                </div>

            </div>


        </div>

        <div className='container'>
            
                <div className='stat-card'>
                                
                        <h2>Age</h2>

                </div>     
                
               <div className='stat-card'>
                                
                        <h2>Sex</h2>

                </div>    
        </div>

        <div className='container'>

            <div className='stat-card'>

                   <Bar data={AgeChartData} options={ageChartOptions} />

            </div> 
    
           <div className='stat-card'>
                <Pie data={sexChartData} options={sexChartOptions}  />

            </div>
        </div>


        <div className='contents'>

            
            <div className='stat-card'>

                <h1>Animal Bite Summary Table</h1>

            </div>

    
            <div className='table-container'>
                <table className='table-cont'>
                    <thead>
                        <tr>
                            <th>Animal Names</th>
                            <th>Total of Cases</th>
                            <th>New Case (as per {formattedDate})</th>
                            <th>Common Street</th>

                        </tr>
                    </thead>

                    <tbody>
                        {/*currentData*/sampleData.map((record, index) => (
                            <tr key={index}>
                                <td>{record["Animal"]}</td>
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

export default AnimalBiteReport;   
