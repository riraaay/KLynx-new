import { useEffect, useState } from 'react';
import './Prenatal.css';
import Sidebar from '../../components/Navbar';
import { toast } from 'react-toastify';


function Intrapartum() 
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
  const [showSpouse, setShowSpouse] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
   

  const [isEditing, setIsEditing] = useState(false);

  const itemsPerPage = 8;

  // const [data, setData] = useState([]);

   //set active modal 
     const [activeTab, setActiveTab] = useState('');


  const [formData, setFormData] = useState({
            familyId: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Age: '',
            Bday: '',
            CivilStat: '',
            Occupation: '',
            Educ: '',
            Gravida: '',
            Para: '',
            LMP: '',
            EDD: '',
            TDStatus: '',
             PhilHealth: '',

  });

const [generalDetails, setGeneralDetails] = useState({
    name: '',
    username: '',
    contact: '',
    password: ''
});

 
// Form Data for View Record
 const [view, setView] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const recordData = {
    familyId: "",
    date: "",
    age: "",
    bppr: "",
    htwt: "",
    temp: "",
    chiefComplaint: "",
    diagnosis: "", 
    
  };



const handleViewClick = () => {
  setSelectedRecord(recordData);
  setView(true);
  setActiveTab(false);
  setShowModal(false);
};


const closeRecordModal = () => {
  setView(false);
  setSelectedRecord(null);
  setActiveTab(true);
  setShowModal(true);
};

// Sample for Search query 
const [query, setQuery] = useState('');
const items = ['ABC123', 'Smith', 'Juan', 'Dela Cruz', 'BCD234'];

const filteredItems = items.filter(item =>
  item.toLowerCase().includes(query.toLowerCase())
);

 // deleting the record
//  const handleDelete = (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this?");
//     if (confirmed) {
//       setData(prev => prev.filter(item => item.id !== id));
//     }
//   };

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


    // Fetch Prenatal Record
      const handleSubmit3 =() => 
      {
        if (
          !formData.familyId ||
          !formData.LastName ||
          !formData.FirstName ||
          !formData.MiddleName ||
          !formData.Age ||
          !formData.Bday ||
          !formData.CivilStat ||
          !formData.Occupation ||
          !formData.Educ ||
           !formData.Gravida ||
          !formData.Para || 
          !formData.LMP ||
          !formData.EDD ||
          !formData.TDStatus ||
          !formData.PhilHealth
        ) {
          toast.error("Please enter all the fields");
          return;
        }

        // Create FormData object
        // Change the URL to the prenatal PHP file
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
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Age: '',
            Bday: '',
            CivilStat: '',
            Occupation: '',
            Educ: '',
            Gravida: '',
            Para: '',
            LMP: '',
            EDD: '',
            TDStatus: '',
             PhilHealth: '',
          });
          setShowModal(false);
          toast.success("Prenatal Record Added Successfully");
        })
      };

    // Fetch Prenatal Record
    // useEffect(() =>
    // {
    //   fetch("http://localhost/OneCaintaRecord/fetchConsultation.php")
    //   .then((response) => response.json())
    //   .then((data) => setMockData(data))
    //     .catch(() => toast.error("Unable to fetch data"));
    // }, []);

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
        FirstName: record["First Name"],
        LastName: record["Last Name"],
        MiddleName: record["Middle Name"],
        Age: record["Age"],
        Bday: record["Birthdate"],
        CivilStat: record["Civil Status"],
        Occupation: record["Occupation"],
        Educ: record["Educational Attainment"],
        Gravida: record["Gravida"],
        Para: record["Para"],
        LMP: record["LMP"],
        EDD: record["EDD"],
        TDStatus: record["TD Status"],
         PhilHealth: record["PhilHealth"],
      });
      setIsEditing(true);
    } else {
      setFormData({
          familyId: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Age: '',
            Bday: '',
            CivilStat: '',
            Occupation: '',
            Educ: '',
            Gravida: '',
            Para: '',
            LMP: '',
            EDD: '',
            TDStatus: '',
             PhilHealth: '',
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setActiveTab(false);
    setView(false);
    setShowSpouse(false);
    setShowRecord(false);
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
            Intrapartum
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
        
              
            <label htmlFor="show-option"><h3>Show</h3></label>
            <select name="show-option" id="show">
              <option value="opt1">Option 1</option>
              <option value="opt2">Option 2</option>
              <option value="opt3">Option 3</option>
            </select>

  
            <button className="adit" onClick={() => handleModalOpen()}>
              Add
            </button>

 

            <div className='patrec-btn'>
              <label htmlFor="search"><h3>Search:</h3></label>
              <input type="text" 
              value={query}  
              name='search' 
              id='search'
              onChange={(e) => setQuery(e.target.value)}
              />

        {query && (
        <ul>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      )}  
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="table-cont">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Family ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Contact No.</th>
                <th>Record</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {currentData.map((item) => (
                <tr key={item.id||item.familyId}>
                  <td>{item.patientId}</td>
                  <td>{item.familyId}</td>
                  <td>{item.LastName}</td>
                  <td>{item.FirstName}</td>
                  <td>{item.MiddleName}</td>
                  <td>{item.ContactNo}</td>
                  <td><button>View</button></td>
                  <td>  <button className="delete">
                     <button
                    className="edit"
                    onClick={() => handleModalOpen(currentData)} 
                  >
                   <i className="fa-solid fa-pen-to-square"></i>
                  </button> 
                   <i className="fa-solid fa-trash-can"></i>
                  </button>
                  </td>

                  {/* <td>
                    <button className="action-btn" 
                    onClick={() => handleModalOpen(item)}
                    >
                      View
                    </button>
                  </td> */}
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
        <div className="modal-prenatal">
          <div className="modal-content-prenatal">
           <div className='tab-buttons'>

                <button onClick={() => { setShowSpouse(false); setShowRecord(false);
                 setShowModal(true); } } >Patient Profile</button>

                <button onClick={() => { setShowSpouse(true); setShowRecord(false);
              setShowModal(false); } } >Husband/Wife Profile</button>


                <button onClick={() => { setShowSpouse(false); setShowRecord(true);
                setShowModal(false); } } >Record</button>
            
            </div>

          <form className='record-form' onSubmit={handleFormSubmit}>

            <div className='inputs-column'>

                <div className='inputs'>
                    <label htmlFor="LastName">Last Name </label>
                      <input
                        type="text"
                        name="LastName"
                        id='LastName'
                        value={formData.LastName}
                        onChange={handleFormChange}
                        placeholder="Enter Last Name"
                        required
                      />
                </div>

                <div className='inputs'>

                    <label htmlFor="FirstName">First Name </label>
                      <input
                        type="text"
                        name="FirstName"
                        id='FirstName'
                        value={formData.FirstName}
                        onChange={handleFormChange}
                        placeholder="Enter First Name"
                        required
                      />
                </div>
           
                <div className='inputs'>
                    <label htmlFor="MiddleName">Middle Name</label>
                        <input
                          type="text"
                          name="MiddleName"
                          id='MiddleName'
                          value={formData.MiddleName}
                          onChange={handleFormChange}
                          placeholder="Enter Middle Name"

                        />
                </div>
            </div>

            <div className='inputs-column'>
                <div className='inputs'>
                          <label htmlFor="Age">Age</label>
                              <input
                                type="text"
                                name="Age"
                                id='Age'
                                value={formData.Age}
                                onChange={handleFormChange}
                                placeholder="Enter Age"
                                required
                              />
                  </div>    

                  <div className='inputs'> 
                          <label htmlFor="Bday">Birthdate </label>
                              <input
                                type="date"
                                name="Bday"
                                id='Bday'
                                value={formData.Bday}
                                onChange={handleFormChange}
                                placeholder="Birthdate"
                                required
                              />
                  </div>      

                  <div className='inputs'>
                        <label htmlFor="civilStat">Civil Status</label>
                            <select name="civilStat" required> 
                                    <option hidden></option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorce">Divorce</option>
                                    <option value="separated">Separated</option>
                                    <option value="widowed">Widowed</option>
                            </select>
                  </div>  
            </div>   

            <div className='inputs-column'>

                <div className='inputs'>  
                            <label htmlFor="Occupation">Occupation</label>
                                <input
                                  type="text"
                                  name="Occupation"
                                  id='Occupation'
                                  value={formData.Occupation}
                                  placeholder='Enter Occupation'
                                  onChange={handleFormChange}
                                  required
                                />
                </div>        

                <div className='inputs'>
                            <label htmlFor="Educ">Educational Attainment</label>
                                <input
                                  type="text"
                                  name="Educ"
                                  id='Educ'
                                  value={formData.Educ} 
                                  placeholder='Enter Educational Attainment'
                                  onChange={handleFormChange}
                                  required
                                />
                </div>

                <div className='inputs'>
                            <label htmlFor="Contact">Contact No.</label>
                                <input
                                  type="text"
                                  name="Contact"
                                  id='Contact'
                                  value={formData.Contact} 
                                  placeholder='Enter Contact No.'
                                  onChange={handleFormChange}
                                  required
                                />
                </div>       
            </div>

            <div className='inputs-column'>

              <div className='inputs'>
                    <label htmlFor="Gravida">Gravida</label>
                      <input
                        type="text"
                        name="Gravida"
                        id='Gravida'
                        value={formData.Gravida}
                        placeholder='Gravida'
                        onChange={handleFormChange}
                        required
                      />
              </div>

              <div className='inputs'>
                    <label htmlFor="Para">Para</label>
                      <input
                        type="text"
                        name="Para"
                        id='Para'
                        value={formData.Para}
                        placeholder='Para'
                        onChange={handleFormChange}
                        required
                      />
              </div>   

              <div className='inputs'>
                    <label htmlFor="LMP">LMP</label>
                      <input
                        type="text"
                        name="LMP"
                        id='LMP'
                        value={formData.LMP}
                        placeholder='LMP'
                        onChange={handleFormChange}
                        required
                      />
              </div>    
            </div>

            <div className='inputs-column'> 
              <div className='inputs'>
                    <label htmlFor="EDD">EDD</label> 
                      <input
                        type="text"
                        name="EDD"
                        id='EDD'
                        value={formData.EDD}
                        placeholder='EDD'
                        onChange={handleFormChange}
                        required
                      />
              </div>

              <div className='inputs'>
                    <label htmlFor="TDStatus">TD Status</label>
                    <input
                      type="text"
                      name="TDStatus"
                      id='TDStatus'
                      value={formData.TDStatus}
                      placeholder='TD Status'
                      onChange={handleFormChange}
                      required
                    />
              </div>  

              <div className='inputs'>
                    <label htmlFor="PhilHealth">PhilHealth</label>
                    <input
                      type="text"
                      name="PhilHealth"
                      id='PhilHealth'
                      value={formData.PhilHealth}
                      placeholder='PhilHealth No.'
                      onChange={handleFormChange}
                      required
                    />                 
              </div>
            </div> 
          
            </form> 
            <div className='buttons'>
             <button className='submit-btn' type="submit" onClick={handleSubmit3}>Save</button>
              <button className='close-btn' type="button" onClick={handleModalClose}>
            
                Close
              </button>
              </div>
          </div>
        </div>
      )}

       {view && (
                  <div className='modal-prenatal'>
                    <div className='modal-content-prenatal'>
                      <h2>Record</h2>
                      <table>
                        <thead>
                          <tr>
                           
                            <th>Date</th>
                            <th>Age</th>
                           <th>BP/PR</th>
                            <th>HT/WT</th>
                          <th>Temperature</th>
                            <th>Chief Complaint</th>
                            <th>Diagnosis/Medication</th>
                           
                          </tr>
                        </thead>
                        <tbody>

                          <tr key={selectedRecord.familyId}>
                            <td>{selectedRecord.date}</td>
                            <td>{selectedRecord.age}</td>
                            <td>{selectedRecord.bppr}</td>
                            <td>{selectedRecord.htwt}</td>
                            <td>{selectedRecord.temp}</td>
                            <td>{selectedRecord.chiefComplain}</td>
                            <td>{selectedRecord.diagnosis}</td>
                          </tr>
                        </tbody>
                      </table>
                       <button onClick={closeRecordModal} className='viewclose-btn'>Close</button>

                    </div>
                  </div>
                )}

       {showSpouse && (
        <div className="modal-prenatal">
          <div className="modal-content-prenatal">
            <div className='tab-buttons'>

                <button onClick={() => { setShowSpouse(false); setShowRecord(false);
                 setShowModal(true); } } >Patient Profile</button>

                <button onClick={() => { setShowSpouse(true); setShowRecord(false);
              setShowModal(false); } } >Husband/Wife Profile</button>


                <button onClick={() => { setShowSpouse(false); setShowRecord(true);
                setShowModal(false); } } >Record</button>
            
            </div>

          <form className='record-form' onSubmit={handleFormSubmit}>
              <div className='inputs-column'>
                  <div className='inputs'>
                            <label htmlFor="LastName">Last Name  </label>
                                <input
                                  type="text"
                                  name="LastName"
                                  id='LastName'
                                  value={formData.LastName}
                                  onChange={handleFormChange}
                                  placeholder="Enter Last Name"
                                  required
                                />
                  </div>  

                  <div className='inputs'>
                            <label htmlFor="FirstName">First Name</label>
                            <input
                              type="text"
                              name="FirstName"
                              id='FirstName'
                              value={formData.FirstName}
                              onChange={handleFormChange}
                              placeholder="First Name"
                              required
                            />
                  </div>       

                  <div className='inputs'>
                            <label htmlFor="MiddleName">Middle Name</label>
                            <input
                              type="text"
                              name="MiddleName"
                              id='MiddleName'
                              value={formData.MiddleName}
                              onChange={handleFormChange}
                              placeholder="Middle Name"
                            />
                  </div>        
                           
              </div>

              <div className='inputs-column'>
                  <div className='inputs'>
                            <label htmlFor="Age">Age</label>
                                <input
                                  type="text"
                                  name="Age"
                                  id='Age'
                                  value={formData.Age}
                                  onChange={handleFormChange}
                                  placeholder="Age"
                                  required
                                />
                    </div>        

                    <div className='inputs'>
                            <label htmlFor="Bday">Birthdate</label>
                                <input
                                  type="date"
                                  name="Bday"
                                  value={formData.Bday}
                                  id='Bday'
                                  onChange={handleFormChange}
                                  placeholder="Birthdate"
                                  required
                                />
                    </div>     

                    <div className='inputs'>   
                          <label htmlFor="civilStat">Civil Status</label>
                              <select name="civilStat"> 
                                    <option hidden></option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorce">Divorce</option>
                                    <option value="separated">Separated</option>
                                    <option value="widowed">Widowed</option>
                              </select>
                    </div>      
              </div>

              <div className='inputs-column'>
                    <div className='inputs'>
                            <label htmlFor="Occupation">Occupation</label>
                                <input
                                  type="text"
                                  name="Occupation"
                                  id='Occupation'
                                  value={formData.Occupation}
                                  placeholder='Occupation'
                                  onChange={handleFormChange}
                                  required
                                />
                    </div>   

                    <div className='inputs'>    
                            <label htmlFor="Educ">Educational Attainment</label>
                                <input
                                  type="text"
                                  name="Educ"
                                  id='Educ'
                                  value={formData.Educ} 
                                  placeholder='Educational Attainment'
                                  onChange={handleFormChange}
                                  required
                                />
                    </div>      

                    <div className='inputs'>
                            <label htmlFor="ContactNo">Contact No.</label>
                                <input
                                  type="text"
                                  name="ContactNo"
                                  id='ContactNo'
                                  value={formData.ContactNo}
                                  placeholder='Contact Number'
                                  onChange={handleFormChange}
                                  required
                                />
                    </div>            
              </div>

              <div className='inputs-column'>
                <div className='inputs'>
                            <label htmlFor="PhilHealth">PhilHealth No.</label>
                                <input
                                  type="text"
                                  name="PhilHealth"
                                  value={formData.PhilHealth}
                                  placeholder='PhilHealth No.'
                                  onChange={handleFormChange}
                                  required
                                />
                </div>
                
                <div className='inputs'>
                            <label htmlFor="Address">Complete Address</label>
                                <input
                                  type="text"
                                  name="Address"
                                  value={formData.Address}
                                  placeholder='Complete Address'
                                  onChange={handleFormChange}
                                  required
                                />
                 </div>            
              </div>
            </form> 
            <div className='buttons'>
             <button className='submit-btn' type="submit" onClick={handleSubmit3}>Save</button>
              <button className='close-btn' type="button" onClick={handleModalClose}>
                Close
              </button>
              </div>
          </div>
        </div>
      )}


      {showRecord && (

        <div className="modal-prenatal">

          <div className="modal-content-prenatal">

            <div className='tab-buttons'>

                <button onClick={() => { setShowSpouse(false); setShowRecord(false);
                 setShowModal(true); } } >Patient Profile</button>

                <button onClick={() => { setShowSpouse(true); setShowRecord(false);
              setShowModal(false); } } >Husband/Wife Profile</button>


                <button onClick={() => { setShowSpouse(false); setShowRecord(true);
                setShowModal(false); } } >Record</button>
            
            </div>
            
            <form className="record-form" onSubmit={handleFormSubmit}>
              <div className='inputs-column'>
                <div className='inputs'>
                    <label htmlFor="date-record">Date</label>
                        <input
                          type="date"
                          name="date-record"
                          id='date-record'
                          onChange={handleFormChange}
                          placeholder="Date"
                          required
                        />
                  </div>    

                  <div className='inputs'>
                    <label htmlFor="aog-record">AOG</label> 
                        <input
                          type="text"
                          name="aog-record"
                          id='aog-record'
                          onChange={handleFormChange}
                          placeholder="Enter AOG"
                          required
                        />
                  </div>
                </div>

                <div className='inputs-column'>
                  <div className='inputs'>
                    <label htmlFor="blood-pressure-record">Blood Pressure</label> 
                        <input
                          type="text"
                          name="blood-pressure-record"
                          id='blood-pressure-record'
                          onChange={handleFormChange}
                          placeholder="Enter Blood Pressure"
                          required
                        />         
                  </div>

                  <div className='inputs'>
                    <label htmlFor="pulse-record">Pulse Rate</label> 
                        <input
                          type="text"
                          name="pulse-record"
                          id='pulse-record'
                          onChange={handleFormChange}
                          placeholder="Enter Pulse Rate"
                          required
                        />
                  </div>
                </div>

                <div className='inputs-column'>
                  <div className='inputs'>
                    <label htmlFor="height-record">Height</label> 
                        <input
                          type="text"
                          name="height-record"
                          id='height-record'
                          onChange={handleFormChange}
                          placeholder="Enter Height"
                          required
                        />
                  </div>

                  <div className='inputs'>
                    <label htmlFor="weight-record">Weight</label> 
                        <input
                          type="text"
                          name="weight-record"
                          id='weight-record'
                          onChange={handleFormChange}
                          placeholder="Enter Weight"
                          required
                        />
                  </div>
                </div>

                <div className='inputs-column'> 
                  <div className='inputs'>
                    <label htmlFor="temperature-record">Temperature</label> 
                        <input
                          type="text"
                          name="temperature-record"
                          id='temperature-record'
                          onChange={handleFormChange}
                          placeholder="Enter Temperature"
                          required
                        />
                  </div>

                  <div className='inputs'>
                    <label htmlFor="contact-record">Contact</label> 
                        <input
                          type="text"
                          name="contact-record"
                          id='contact-record'
                          onChange={handleFormChange}
                          placeholder="Enter Contact Number"
                          required
                        />
                  </div>
                </div> 

                <div className='inputs-column'>
                  <div className='inputs'>
                    <label htmlFor="chief-complain-record">Chief Complaint</label> 
                        <input
                          type="text"
                          name="chief-complain-record"
                          id='chief-complain-record'
                          onChange={handleFormChange}
                          placeholder="Enter Chief Complaint"
                          required
                        />
                  </div>
                </div>

              
                  <div className='inputs'>
                      <label htmlFor="note-record">Description</label>
                          <select name="note-record"  required > 
                            <option hidden></option>
                              <option value="opt1" id='opt1'>Deliveries</option>
                              <option value="opt2" id='opt2'>Live birth</option>
                              <option value="opt3" id="opt3">Live birth with normal birth weight</option>
                              <option value="opt4" id='opt4'>Live birth with low birth weight</option>
                              <option value="opt5" id='opt5'>Live birth with unknown birth weight</option>
                              <option value="opt6" id='opt6'>Delivery attended by skilled health professionals</option>
                              <option value="opt7" id='opt7'>Delivery attended by a doctor</option>
                              <option value="opt8" id='opt8'>Delivery attended by a nurse</option>
                              <option value="opt9" id='opt9'>Delivery attended by midwives</option>
                              <option value="opt10" id='opt10'>Delivery in public health facility</option>
                              <option value="opt11" id='opt11'>Delivery in private health facility</option>
                              <option value="opt12" id='opt12'>Non-facility based delivery</option>
                              <option value="opt13" id='opt13'>Vaginal delivery</option>
                              <option value="opt14" id='opt14'>Delivery by cesarian section</option>
                              <option value="opt15" id='opt15'>Full term birth</option>
                              <option value="opt16" id='opt16'>Pre-term birth</option>
                              <option value="opt17" id='opt17'>Fetal death</option>
                              <option value="opt18" id='opt18'>Abortion/Miscarriage</option>
                          </select>    
                  </div>
            </form>

            <div className='buttons'>
                <button className='submit-btn' type="submit" onClick={handleSubmit3}>Save</button>
                  <button className='close-btn' type="button" onClick={handleModalClose}>
                    Close
                  </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


export default Intrapartum;