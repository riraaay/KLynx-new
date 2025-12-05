import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./consult.css";
import Sidebar from "../../components/Sidebar";

function Patientrecord() {
  const [records, setRecords] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  const [window1, setWindow1] = useState(false);
  const [window2, setWindow2] = useState(false);

  //settings
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  
  // State htmlFor general details
  const [generalDetails, setGeneralDetails] = useState({
  name: 'John Doe',
  username: 'John123',
  contact: '+1234567890',
  password: '123456'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralDetails(prevDetails => ({
        ...prevDetails,
        [name]: value
    }));
};

const handleSave = () => {
  localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
  alert('Account details saved successfully!');
  setShowManageAccount(false);
};


  // Edit account state
  // Load account details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('accountDetails'));
    if (savedDetails) {
        setGeneralDetails(savedDetails);
    }
}, []);


// Admin account management

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
         

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Number of records per page

  // Patient Record State
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [famID2, setFamID2] = useState("");
  const [bday, setBday] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [emergency, setEmergency] = useState("");
  const [work, setWork] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [workAdd, setWorkAdd] = useState("");
  const [marStat, setMarStat] = useState("");
  const [email, setEmail] = useState("");

  // Vital Sign State
  const [famID1, setfamID1] = useState("");
  const [patName, setPatName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [temp, setTemp] = useState("");
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");

  // Fetch Vital Sign
  const handleSubmit = () => 
    {
    if (!famID1 || 
      !patName || 
      !height || 
      !weight || 
      !temp || 
      !sbp || 
      !dbp) 
      {
        alert('Please fill out all fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('famID1', famID1);
    formData.append('patName', patName);
    formData.append('height', height);
    formData.append('weight', weight);
    formData.append('temp', temp);
    formData.append('sbp', sbp);
    formData.append('dbp', dbp);
  
    // Send data to the backend (PHP script)
    fetch("http://localhost/OneCaintaRecord/insertVitalSign.php", 
    {
      method: "POST",
      body: formData,
    })
      .then((response) => 
      {
        if (!response.ok) 
        {
          throw new Error("Failed to submit data");
        }
        return response.text();
      })

      .then(() => {
        setfamID1('');
        setPatName('');
        setHeight('');
        setWeight('');
        setTemp('');
        setSbp('');
        setDbp('');
        
        // closeWindow(result, setWindow2);
        toast.success('Vital signs recorded successfully!');
      });

      
    };

  // Fetch Patient Record
     const handleSubmit2 = () => {
      if (
        !firstName ||
        !middleName ||
        !lastName ||
        !famID2 ||
        !bday ||
        !gender ||
        !contact ||
        !emergency ||
        !work ||
        !block ||
        !street ||
        !barangay ||
        !city ||
        !workAdd ||
        !marStat ||
        !email
      ) {
        alert("Please fill out all fields.");
        return;
      }
    
      // Create FormData and append all input values
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("famID2", famID2);
      formData.append("bday", bday);
      formData.append("gender", gender);
      formData.append("contact", contact);
      formData.append("emergency", emergency);
      formData.append("work", work);
      formData.append("block", block);
      formData.append("street", street);
      formData.append("barangay", barangay);
      formData.append("city", city);
      formData.append("workAdd", workAdd);
      formData.append("marStat", marStat);
      formData.append("email", email);
    
      // Send data to the backend (PHP script)
      fetch("http://localhost/OneCaintaRecord/insertPatientData.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit data");
          }
          return response.text();
        })
        .then((result) => {
          // Reset state variables to clear the form
          setFirstName("");
          setMiddleName("");
          setLastName("");
          setFamID2("");
          setBday("");
          setGender("");
          setContact("");
          setEmergency("");
          setWork("");
          setBlock("");
          setStreet("");
          setBarangay("");
          setCity("");
          setWorkAdd("");
          setMarStat("");
          setEmail("");
    
          // Handle success response
          closeWindow(result, setWindow2);
          toast.success('Patient Record successfully!');
        })
        
    };         



  // Fetch records on component mount
  useEffect(() => {
    fetch("http://localhost/OneCaintaRecord/fetchRecord.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);  // Check the data here
        setRecords(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        toast.error("Failed to fetch records.");
      });
  }, []);
  

  // Pagination logic
  const totalPages = Math.ceil(records.length / pageSize);
  const paginatedRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (Page) => 
  {
      setCurrentPage(Page);
    
  };


  // Function to view vital signs
  const handleViewVitalSigns = (familyID) => {
    if (familyID !== famID2) {
      alert("There are no vital signs input yet htmlFor this person.");
      return;
    }
  };


  // Functions to open/close windows
  const openWindow = (setWindowVisible) => {setWindowVisible(true)};
  const closeWindow = (setWindowVisible) => {setWindowVisible(false)};


  // Main function
  return (
    <div className="container">
      <div className="navbar">
        <Sidebar />
      </div>
      <div className="main">
        <div className="header">
          <h2>
            <i className="fa-solid fa-file-medical fa-lg"></i> Patient Record
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

            <input type="text"
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
            </ul>
   */}
            
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
          
          <button onClick={() => openWindow(setWindow1)} className="opt">
                <i className="fa-solid fa-plus fa-xs"></i> Vital Sign
              </button>
              {window1 && (
                  <div id="window1" className="win" style={{display: "block"}}>
                      <div className="winvit_content">
                      Patient Vital Sign{"     "}
                      <span
                        className="close"
                        onClick={() => closeWindow(setWindow2)}
                      >
                        &times;
                      </span>
                              
                             <div className="input">
                            <span>
  
                              <label htmlFor="famID1">Family ID</label>
                              <input type="text" name="famID1" id="famID1" value={famID1} onChange={(e) => setfamID1(e.target.value)}/>

                              <label htmlFor="patName">Patient Name</label>
                              <input type="text" name="patName" id="patName" value={patName} onChange={(e) => setPatName(e.target.value)}/>
  
                            </span>
  
                            <span>
                              <label htmlFor="height">Height(cm)</label>
                              <input type="text" name="height" id="height" value={height} onChange={(e) => setHeight(e.target.value)}/>
  
                              <label htmlFor="Weight">Weight(kg)</label>
                              <input type="text" name="weight" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)}/>
  
                              <label htmlFor="temp">Temperature(℃)</label>
                              <input type="text" name="temp" id="temp" value={temp} onChange={(e) => setTemp(e.target.value)} />
  
                            </span>
  
                          
                            <span>
                              <label htmlFor="sbp">Systolic Blood Pressure</label>
                              <input type="text" name="sbp" id="sbp"  value={sbp} onChange={(e) => setSbp(e.target.value)}/>
  
                              <label htmlFor="dbp">Diastolic Blood Pressure</label>
                              <input type="text" name="dbp" id="dbp" value={dbp} onChange={(e) => setDbp(e.target.value)}/>
                            </span>
  
                              </div>
                              <button id="record" className="record_btn" onClick={handleSubmit}>Submit</button> 
                               <button id="close" className="close_btn" onClick={() => closeWindow(setWindow1)}>Close</button> 
        
                      </div>
                  </div>
              )}  
                  <button  onClick={() => openWindow(setWindow2)} className="opt"><i className="fa-solid fa-user-plus fa-sm"></i> Patient Register</button>
                     {window2 && (
                 
  
                      <div id="window2" className="win" style={{display: "block"}}>
                          <div className="winreg_content">
                              <h2> Patient Register <span className="close" onClick={() => closeWindow(setWindow2)}>&times;</span></h2>
                                  <div className="input1">
                                      <span>
                                          <input type="text" name="first" id="first" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                               
                                          <input type="text" name="middle" id="middle" placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)}/>
                             
                                          <input type="text" name="last" id="last" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                      </span>
                                      
  
                              <div className="fbg">
                               <label htmlFor="famID2">Family ID</label>
                               <input type="text" name="famID2" id="famID2" value={famID2} onChange={(e) => setFamID2(e.target.value)}/>

                               <label htmlFor="bday">Birthdate</label>
                               <input type="date" name="bday" id="bday" value={bday} onChange={(e) => setBday(e.target.value)}/>
                              
                              
                              <span>
                                <label htmlFor="radio">Sex</label>
                               <input type="radio" id="female" value="Female" name="gender" checked={gender === "Female"} onChange={() => setGender("Female")}/>
                               <label htmlFor="female">Female</label>
                               <input type="radio" id="male" value="Male" name="gender" checked={gender === "Male"} onChange={() => setGender("Male")}/>
                               <label htmlFor="male">Male</label>
                              </span>
                              </div>
  
  
                              <div className="cew">
                                <span>
                               <label htmlFor="contact">Contact Number</label>
                               <input type="text" name="contact" id="contact" value={contact} onChange={(e) => setContact(e.target.value)}/>
                               <label htmlFor="emergency">Emergency Contact Number</label>
                               <input type="text" name="emergency" id="emergency" value={emergency} onChange={(e) => setEmergency(e.target.value)}/>
                               <label htmlFor="work">Work Contact Number</label>
                               <input type="text" name="work" id="work" value={work} onChange={(e) => setWork(e.target.value)}/>  
                              </span>
                              </div>
  
                      
                              <div className="hwme">
                                <span>
                                <label htmlFor="address">Home Address</label>
                                <input type="text" name="block" id="block" placeholder="Block & Lot / Building No.." value={block} onChange={(e) => setBlock(e.target.value)}/>

                                <input type="text" name="street" id="street" placeholder="Street Name." value={street} onChange={(e) => setStreet(e.target.value)}/>
                                
                                <input type="text" name="barangay" id="barangay" placeholder="Barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)}/>
                                
                                <input type="text" name="city" id="city" placeholder="City/Municipality" value={city} onChange={(e) => setCity(e.target.value)}/>
                              </span>
  
                              <span>
                                <label htmlFor="workAdd">Work Address</label>
                                <input type="text" name="workAdd" id="workAdd" value={workAdd} onChange={(e) => setWorkAdd(e.target.value)}/>
                                <label htmlFor="marStat">Marital Status</label>
                                <input type="text" name="marStat" id="marStat" value={marStat} onChange={(e) => setMarStat(e.target.value)}/>
                                <label htmlFor="email">Email Address</label>
                                <input type="text"name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                              </span>
                              </div>
                              </div>
                              <button id="record" className="record_btn" onClick={handleSubmit2}>Register</button> 
                              <button id="close" className="close_btn" onClick={() => closeWindow(setWindow2)}>Close</button>  
                          </div>
                      </div>
                  )}
                  </div>

          <div className="search">
            <i className="fa-solid fa-filter fa-sm"></i>
            <input type="text" placeholder="Search.." />
          </div>
        </div>

        <div className="table-container">
          <table className="table-cont">
            <thead>
              <tr>
                <th>Family ID</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Sex</th>
                <th>Contact No</th>
                <th>Address</th>
                <th>Marital Status</th>
                <th>Vital Signs</th>
              </tr>
            </thead>
            <tbody>
                {records.length > 0 ? (
                   paginatedRecords.map((record, index) => (
                    <tr key={index}>
                    <td>{record['Family ID']}</td>
                    <td>{record['Full Name']}</td>
                    <td>{record['Birthdate']}</td>
                    <td>{record['Sex']}</td>
                    <td>{record['Contact Number']}</td>
                    <td>{record['Full Address']}</td>
                    <td>{record['Marital Status']}</td>
                    <td>
                      <button
                        onClick={() => handleViewVitalSigns(record["Family ID"],record['Full Name'])}
                        className="opt"
                      >
                        <i className="fa-solid fa-plus fa-xs"></i> View Vital
                        Sign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No data available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-btn ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patientrecord;
