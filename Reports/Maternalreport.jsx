import { useEffect, useState } from 'react';
import './MaternalReport.css';
import Sidebar from '../src/components/sidebar.jsx';
import { Line, Bar, Pie } from "react-chartjs-2";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import 'chart.js/auto'; // Import chart.js to enable chart rendering

// Generate Maternal Care PDF Report 
import { generatePDF } from '../Utility/MCReportPDF';


const mock = new MockAdapter(axios);

// Delete when there is a real data
const samplePrenatalData = [
  {
    "Description": "Pregnant women with first visit",
    "Age: 10-14": 0,
    "Age: 15-19": 11,
    "Age: 20-49": 27
  },
  {
    "Description": "Pregnant women with complications",
    "Age: 10-14": 0,
    "Age: 15-19": 17,
    "Age: 20-49": 24
  },
  {
    "Description": "Pregnant women receiving prenatal vitamins",
    "Age: 10-14": 0,
    "Age: 15-19": 11,
    "Age: 20-49": 28
  },
  {
    "Description": "Pregnant women tested positive",
    "Age: 10-14": 0,
    "Age: 15-19": 4,
    "Age: 20-49": 15
  }
];

const sampleIntrapartumData = [
  {
    "Description": "Number of Deliveries",
    "Age: 10-14": 0,
    "Age: 15-19": 14,
    "Age: 20-49": 18
  },
  {
    "Description": "Number of Live Births",
    "Age: 10-14": 0,
    "Age: 15-19": 24,
    "Age: 20-49": 20
  },
  {
    "Description": "Number of Deliveries attended by a skilled health professional",
    "Age: 10-14": 0,
    "Age: 15-19": 14,
    "Age: 20-49": 17
  },
  {
    "Description": "Number of Deliveries with complications",
    "Age: 10-14": 0,
    "Age: 15-19": 4,
    "Age: 20-49": 10
  }
];

const samplePostpartumData = [
  {
    "Description": "Number of Pregnant women are diagnosed with hypertension",
    "Age: 10-14": 0,
    "Age: 15-19": 17,
    "Age: 20-49": 22
  },
  {
    "Description": "Number of Pregnant women who give birth who have access the closest health facility",
    "Age: 10-14": 0,
    "Age: 15-19": 10,
    "Age: 20-49": 12
  },
  {
    "Description": "Number of Pregnant women who give birth for the first time",
    "Age: 10-14": 0,
    "Age: 15-19": 6,
    "Age: 20-49": 39
  },
  {
    "Description": "Number of Pregnant women who give birth who are grand multigravida",
    "Age: 10-14": 0,
    "Age: 15-19": 2,
    "Age: 20-49": 6
  }
];

function MaternalReport() {

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
      const response = await fetch('http://localhost/api/insertAdminAccount.php', {
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

const handleMaternalDownload = async () => {
  try {
    // Get current month and year in Philippine Time
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long',
    });

    // Convert section data to table rows
    const toRows = (arr) =>
      arr.map((item) => {
        const age10_14 = Number(item['Age: 10-14']) || 0;
        const age15_19 = Number(item['Age: 15-19']) || 0;
        const age20_49 = Number(item['Age: 20-49']) || 0;
        const total = age10_14 + age15_19 + age20_49;
        return [item.Description, age10_14, age15_19, age20_49, total];
      });

    // Use sample data — replace with fetched data later
    const sections = [
      {
        sectionTitle: 'Prenatal Report',
        tableHeaders: ['Description', 'Age: 10-14', 'Age: 15-19', 'Age: 20-49', 'Overall Total'],
        tableData: toRows(samplePrenatalData),
      },
      {
        sectionTitle: 'Intrapartum Report',
        tableHeaders: ['Description', 'Age: 10-14', 'Age: 15-19', 'Age: 20-49', 'Overall Total'],
        tableData: toRows(sampleIntrapartumData),
      },
      {
        sectionTitle: 'Postpartum Report',
        tableHeaders: ['Description', 'Age: 10-14', 'Age: 15-19', 'Age: 20-49', 'Overall Total'],
        tableData: toRows(samplePostpartumData),
      },
    ];

    // Call updated generatePDF
    generatePDF({
      title: 'Maternal Care Report',
      monthYear,
      logo: './src/assets/picture/medikablue.png',
      sections,
    });
  } catch (error) {
    console.error('Error generating maternal care report:', error);
    alert('Could not generate the Maternal Care Report PDF.');
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
            Maternal Report
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
            <button className='download'onClick={handleMaternalDownload}>Download Maternal Report</button>
        </div>

        <div className='contents'>

            <div className='stat-card'>
                <h1>Prenatal Care</h1>

            </div>

                 <table className='table-cont'>
                      <thead>
                  <tr>
                    <th>Description</th>
                    <th>Age: 10-14</th>
                    <th>Age: 15-19</th>
                    <th>Age: 20-49</th>
                    <th>Overall Total</th>
                  </tr>
                </thead>
                <tbody>
                  {samplePrenatalData.map((record, index) => {
                    const age10_14 = Number(record["Age: 10-14"]) || 0;
                    const age15_19 = Number(record["Age: 15-19"]) || 0;
                    const age20_49 = Number(record["Age: 20-49"]) || 0;
                    const total = age10_14 + age15_19 + age20_49;

                    return (
                      <tr key={index}>
                        <td>{record["Description"]}</td>
                        <td>{age10_14}</td>
                        <td>{age15_19}</td>
                        <td>{age20_49}</td>
                        <td>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
        </div>

        <div className='contents'>

            
            <div className='stat-card'>

                <h1>Intrapartum Care and Delivery Outcome</h1>

            </div>

    
            <div className='table-container'>
                 <table className='table-cont'>
                      <thead>
                  <tr>
                    <th>Description</th>
                    <th>Age: 10-14</th>
                    <th>Age: 15-19</th>
                    <th>Age: 20-49</th>
                    <th>Overall Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleIntrapartumData.map((record, index) => {
                    const age10_14 = Number(record["Age: 10-14"]) || 0;
                    const age15_19 = Number(record["Age: 15-19"]) || 0;
                    const age20_49 = Number(record["Age: 20-49"]) || 0;
                    const total = age10_14 + age15_19 + age20_49;

                    return (
                      <tr key={index}>
                        <td>{record["Description"]}</td>
                        <td>{age10_14}</td>
                        <td>{age15_19}</td>
                        <td>{age20_49}</td>
                        <td>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>                          
            </div>
             
        </div>


        <div className='contents'>

            
            <div className='stat-card'>

                <h1>Postpartum and New Born Care</h1>

            </div>

            <div className='table-container'>
                 <table className='table-cont'>
                      <thead>
                  <tr>
                    <th>Description</th>
                    <th>Age: 10-14</th>
                    <th>Age: 15-19</th>
                    <th>Age: 20-49</th>
                    <th>Overall Total</th>
                  </tr>
                </thead>
                <tbody>
                  {samplePostpartumData.map((record, index) => {
                    const age10_14 = Number(record["Age: 10-14"]) || 0;
                    const age15_19 = Number(record["Age: 15-19"]) || 0;
                    const age20_49 = Number(record["Age: 20-49"]) || 0;
                    const total = age10_14 + age15_19 + age20_49;

                    return (
                      <tr key={index}>
                        <td>{record["Description"]}</td>
                        <td>{age10_14}</td>
                        <td>{age15_19}</td>
                        <td>{age20_49}</td>
                        <td>{total}</td>
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

export default MaternalReport;   