import { useEffect, useState } from 'react';
import Sidebar from '../../components/Navbar';
import './consult.css';

function TotalPatient() {

//Settings state
   const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
   const [showManageAccount, setShowManageAccount] = useState(false);
       const [showTerms, setShowTerms] = useState(false);
       const [showAddAdmin, setShowAddAdmin] = useState(false);
   
         // State for general details
     const [generalDetails, setGeneralDetails] = useState({
      name: 'John Doe',
      username: 'John123',
      contact: '+1234567890',
      password: '123456'
    });

useEffect(() => {
      const savedDetails = JSON.parse(localStorage.getItem('accountDetails'));
      if (savedDetails) {
          setGeneralDetails(savedDetails);
      }
  }, []);
  
  
  const handleSave = () => {
      // Save the updated details to local storage
      localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
      alert('Account details saved successfully!');
      setShowManageAccount(false);
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
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setGeneralDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };


return(
  <div className='container'>
	<div className='navbar'>
        <Sidebar />
    </div>
    <main className='main-content'>
	 <header className="header">
          <span className="header-text">Dashboard</span>
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
        </header>

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

            Sample output para makita if nag sasave yung admin account
            <h3>Admin Accounts(Sample lang to check if nag aadd)</h3>
            <ul>
                {adminAccounts.map((account, index) => (
                    <li key={index}>{account.username}</li>
                ))}
            </ul>
  
            
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
        <div className='container-upAppt'>
            <h1>Total Number of Patients</h1>

            <div className='container'>

              <div className='stat-card'>
                
                  <h3>Vaccinated</h3>
              </div>
              <div className='stat-card'>
                  <h3>Senior</h3>
              </div>
              <div className='stat-card'>
                  <h3>Minor</h3>
              </div>
              <div className='stat-card'>
                  <h3>Adult</h3>
              </div>

        </div>    

        <div className='container'>
               <div className='stat-card'>
                  <h3>Infant</h3>
              </div>
               <div className='stat-card'>
                  <h3>PWD</h3>
              </div>
               <div className='stat-card'>
                  <h3>Pregnant</h3>
              </div>
          </div>   
          </div>

</main>
</div>






)}
export default TotalPatient;