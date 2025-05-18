import { useEffect, useState } from 'react';
import './consult.css';
import Sidebar from '../../components/Navbar';
import { toast } from 'react-toastify';


function Consultation() 
{
  // Settings and Notifications
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [mockData, setMockData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    familyId: '',
    patientName: '',
    problem: '',
    diagnosis: '',
    procedure: '',
    medication: '',
    doctorName: '',
    date: ''
  });

const [generalDetails, setGeneralDetails] = useState({
    name: '',
    username: '',
    contact: '',
    password: ''
});


  // Load account details from local storage on component mount
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
    

    
  const handleFormChange = (e) => 
    {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };


    // Fetch Consultation Record
      const handleSubmit3 =() => 
      {
        if (
          !formData.familyId ||
          !formData.patientName ||
          !formData.problem ||
          !formData.diagnosis ||
          !formData.procedure ||
          !formData.medication ||
          !formData.doctorName ||
          !formData.date
        ) {
          toast.error("Please enter all the fields");
          return;
        }

        // Create FormData object

        fetch('http://localhost/OneCaintaRecord/insertConsultation.php', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        .then((response) => 
          {
          if (!response.ok) 
          {
            throw new Error("Failed to submit data");
          }
          return response.text();
        })

        .then(() => 
        {
          setFormData({
            familyId: '',
            patientName: '',
            problem: '',
            diagnosis: '',
            procedure: '',
            medication: '',
            doctorName: '',
            date: '',
          });
          setShowModal(false);
          toast.success("Consultation Record Added Successfully");
        })
      };


    // Fetch Consultation Record
    useEffect(() =>
    {
      fetch("http://localhost/OneCaintaRecord/fetchConsultation.php")
      .then((response) => response.json())
      .then((data) => setMockData(data))
        .catch(() => toast.error("Unable to fetch data"));
    }, []);

  // Pagination
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mockData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleModalOpen = (record = null) => {
    if (record) {
      setFormData({
        familyId: record["family ID"],
        patientName: record["Patient Name"],
        problem: record["Problem"],
        diagnosis: record["Diagnosis"],
        procedure: record["Proceed"],
        medication: record["Medication"],
        doctorName: record["Doctor Name"],
        date: record["Date"]
      });
      setIsEditing(true);
    } else {
      setFormData({
        familyId: '',
        patientName: '',
        problem: '',
        diagnosis: '',
        procedure: '',
        medication: '',
        doctorName: '',
        date: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setMockData((prevData) =>
        prevData.map((item, index) =>
          index === currentData.findIndex(record => record["family ID"] === formData.familyId)
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      setMockData((prevData) => [
        ...prevData,
        { ...formData, id: prevData.length + 1 }
      ]);
    }
    setShowModal(false);
  };


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


  
  // Start of the return statement
  return (
    <div className="container">
      <div className="navbar">
        <Sidebar />
      </div>

      <div className="main">
        <div className="header">
          <h2>
            <i className="fa-solid fa-notes-medical fa-lg"></i> Patient Consultation Information
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

        <div className='container'>
          {showManageAccount && (
                       <div className="modal">
                       <div className="modal-content">
                           <h2>Manage Account</h2>
                           <button className="close" onClick={() => setShowManageAccount(false)}>
                               &times;
                           </button>
                           <div className="modal-section">
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
        <div className="modal">
          <div className="modal-content">
            
            <h3>Add Admin Account</h3>
                <button className="close"
                  onClick={() => setShowAddAdmin(false)}
                >
                  &times;
                </button>
          <div className="modal-section">

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
            <div className="modal">
              <div className="modal-content">
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

        <div className="contents">
          <div className="patrec-btn">
            <button className="adit" onClick={() => handleModalOpen()}>
              <i className="fa-solid fa-user-plus fa-sm"></i> Add
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table-cont">
            <thead>
              <tr>
                <th>Family ID</th>
                <th>Patient Name</th>
                <th>Problem</th>
                <th>Diagnosis</th>
                <th>Procedure</th>
                <th>Medication</th>
                <th>Doctor&#39;s Name</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentData.map((item) => (
                <tr key={item.id||item.familyId}>
                  <td>{item.familyId}</td>
                  <td>{item.patientName}</td>
                  <td>{item.problem}</td>
                  <td>{item.diagnosis}</td>
                  <td>{item.procedure}</td>
                  <td>{item.medication}</td>
                  <td>{item.doctorName}</td>
                  <td>{item.date}</td>
                  <td>
                    <button className="action-btn" 
                    onClick={() => handleModalOpen(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Patient Record' :   <i className="fa-solid fa-user-plus fa-sm">  Add Patient Consultation</i>}</h3>
            <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="familyId"
              value={formData.familyId}
              onChange={handleFormChange}
              placeholder="Family ID"
              required
            />
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleFormChange}
              placeholder="Patient Name"
              required
            />
            <input
              type="text"
              name="problem"
              value={formData.problem}
              onChange={handleFormChange}
              placeholder="Problem"
              required
            />
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleFormChange}
              placeholder="Diagnosis"
              required
            />
            <input
              type="text"
              name="procedure"
              value={formData.procedure}
              onChange={handleFormChange}
              placeholder="Procedure"
              required
            />
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleFormChange}
              placeholder="Medication"
              required
            />
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleFormChange}
              placeholder="Doctor's Name"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              required
            />
              <button type="submit" onClick={handleSubmit3}>Save</button>
              <button type="button" onClick={handleModalClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Consultation;
