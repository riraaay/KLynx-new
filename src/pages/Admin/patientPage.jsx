import { useEffect, useState } from 'react';
import './consult.css';
import Sidebar from '../../components/Navbar';
import { toast } from 'react-toastify';


function Patient() 
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

  // const [data, setData] = useState([]);

   //set active modal 
    //  const [activeTab, setActiveTab] = useState('');


  const [formData, setFormData] = useState({
            familyId: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Age: '',
            contact: '',
            sex:'',
            street: '',
            address:'',
            email:'',
            econtact:''


  });

const [generalDetails, setGeneralDetails] = useState({
    name: '',
    username: '',
    contact: '',
    password: ''
});

 
// Form Data for View Record
//  const [view, setView] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const recordData = {
//      familyId: '',
//             LastName: '',
//             FirstName: '',
//             MiddleName: '',
//             Age: '',
//             contact: '',
//             sex:'',
//             street: '',
//             address:'',
//             email:'',
//             econtact:''
    
//   };



// const handleViewClick = () => {
//   setSelectedRecord(recordData);
//   setView(true);
//   setActiveTab(false);
//   setShowModal(false);
// };


// const closeRecordModal = () => {
//   setView(false);
//   setSelectedRecord(null);
//   setActiveTab(true);
//   setShowModal(true);
// };

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
          !formData.sex ||
          !formData.address ||
          !formData.contact ||
          !formData.econtact||
           !formData.street ||
          !formData.email 
        
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
            contact: '',
            sex:'',
            street: '',
            address:'',
            email:'',
            econtact:''
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
        contact: record["Contact"],
        sex: record["Sex"],
        street: record["Street"],
        address: record["Home Address"],
        email: record["Email"],
        econtact: record["Emergency Contact"],
      });
      setIsEditing(true);
    } else {
      setFormData({
          familyId: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Age: '',
            contact: '',
            sex:'',
            street: '',
            address:'',
            email:'',
            econtact:''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
   
  };


//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       setMockData((prevData) =>
//         prevData.map((item, index) =>
//           index === currentData.findIndex(record => record["family ID"] === formData.familyId)
//             ? { ...item, ...formData }
//             : item
//         )
//       );
//     } else {
//       setMockData((prevData) => [
//         ...prevData,
//         { ...formData, id: prevData.length + 1 }
//       ]);
//     }
//     setShowModal(false);
    

//   };


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
            Patient
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



               <button
                    className="edit"
                    onClick={() => handleModalOpen(currentData)} 
                  >
                    Edit
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
                <th>Family ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Manage Account</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {currentData.map((item) => (
                <tr key={item.id||item.familyId}>
                  <td>{item.familyId}</td>
                  <td>{item.LastName}</td>
                  <td>{item.FirstName}</td>
                  <td>{item.MiddleName}</td>
                  <td>{item.Email}</td>
                  <td>{item.ContactNo}</td>
                  <td><button>View</button></td>
                  <td> <button className="delete">
                    Delete
                  </button></td>

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
        <div className="modal">
          <div className="modal-content-patient">
            <label htmlFor="FirstName"><h3>First Name</h3>
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleFormChange}
              placeholder="First Name"
              required
            />
            </label>

               <label htmlFor="LastName"><h3>Last Name</h3>
            <input
              type="text"
              name="LastName"
              value={formData.LastName}
              onChange={handleFormChange}
              placeholder="Last Name"
              required
            />
            </label>
            <label htmlFor="MiddleName"><h3>Middle Name</h3>
            <input
              type="text"
              name="MiddleName"
              value={formData.MiddleName}
              onChange={handleFormChange}
              placeholder="Middle Name"

            />
             </label>
            <label htmlFor="Sex"><h3>Sex</h3>
            <input
              type="radiobutton"
              name="Sex"
              value={formData.sex}
              onChange={handleFormChange}
              placeholder="Sex"
              required
            />
          </label>
            <label htmlFor="Bday"><h3>Birthdate</h3>
            <input
              type="date"
              name="Bday"
              value={formData.Bday}
              onChange={handleFormChange}
              placeholder="Birthdate"
              required
            />
           </label>
           <label htmlFor="civilStat"><h3>Civil Status</h3>
            <select name="civilStat" id="civilStat"> 
              <option value="opt1">Single</option>
              <option value="opt2">Married</option>
              <option value="opt3">Separated</option>
              <option value="opt4">Widowed</option>
              <option value="opt5">Divorced</option>
            </select>
            </label>
            <label htmlFor="Home Address"><h3>Home Address</h3>
             <input
              type="text"
              name="Home Address"
              value={formData.address}
              placeholder='Home Address'
              onChange={handleFormChange}
              required
            />
            </label>
            <label htmlFor="Street"><h3>Street</h3>
             <select name="Street" id="Street"> 
              <option value="opt1">Kayumanggi</option>
              <option value="opt2">Karunungan</option>
              <option value="opt3">Kalinisan</option>
              <option value="opt4">Katapangan</option>
              <option value="opt5">Kagitingan</option>
              <option value="opt6">Katatagan</option>
              <option value="opt7">Karangalan</option>
              <option value="opt8">Katapatan</option>
              <option value="opt9">Kasipagan</option>
              <option value="opt10">Kahusayan</option>
              <option value="opt11">Kabutihan</option>
              <option value="opt12">Katalinuhan</option>
              <option value="opt13">Kabanalan</option>
              <option value="opt14">Kaayusan</option>
              <option value="opt15">Kabayanihan</option>
              <option value="opt16">Kalayaan</option>
            </select>
            </label>
            <label htmlFor="Contact"><h3>Contact Number</h3>
                <input type="text"
                name="Contact"
                value={formData.contact}
                placeholder='Contact'
                onChange={handleFormChange}
                required
                 />
            </label>

            <label htmlFor="eContact"><h3>Emergency Contact Number</h3>
                <input type="text"
                name="eContact"
                value={formData.econtact}
                placeholder='Emergency Contact Number'
                onChange={handleFormChange}
                required
                 />
            </label>

            <div className='modal-buttons'>
             <button type="submit" onClick={handleSubmit3}>Save</button>
              <button type="button" onClick={handleModalClose}>
            
                Close
              </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Patient;