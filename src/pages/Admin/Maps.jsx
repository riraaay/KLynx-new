import { useEffect, useRef, useState } from "react";
import './consult.css';
import Sidebar from "../../components/Sidebar";

function Maps() {
  const mapRef = useRef(null); // Ref for the map container
  const mapInstance = useRef(null); // Ref to hold the Google Maps instance
  //settings state
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
 
// Edit account state
// Load account details from local storage on component mount
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
 

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve(); // Google Maps script is already loaded
        } else {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDUFk8o3Uz2kdANhZrmrnUzSoazVFYDmUs&callback=initMap&v=weekly`;
          script.defer = true;
          script.async = true;

          script.onload = resolve;
          script.onerror = reject;

          document.head.appendChild(script);
        }
      });
    };

    const initMap = () => {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 14.609068627264591, lng: 121.10666166732827 },
        zoom: 18,
        mapTypeControl: false,
      });

      const styleControl = document.getElementById("style-selector-control");
      mapInstance.current.controls[
        window.google.maps.ControlPosition.TOP_LEFT
      ].push(styleControl);

      const styles = {
        default: [],
        silver: [
          { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
          { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        ],
        night: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        ],
        retro: [
          { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        ],
      };

      const styleSelector = document.getElementById("style-selector");
      styleSelector.addEventListener("change", (event) => {
        const selectedStyle = event.target.value;
        mapInstance.current.setOptions({ styles: styles[selectedStyle] });
      });

      const initialStyle = styleSelector.value;
      mapInstance.current.setOptions({ styles: styles[initialStyle] });

      const diseaseLocations = [
        { lat: 14.6091, lng: 121.107, disease: "Dengue", color: "red" },
        { lat: 14.6088, lng: 121.1065, disease: "Malaria", color: "green" },
        { lat: 14.6085, lng: 121.1075, disease: "Tuberculosis", color: "blue" },
        { lat: 14.6095, lng: 121.1075, disease: "Hepatitis", color: "yellow" },
        { lat: 14.609, lng: 121.106, disease: "Typhoid", color: "purple" },
      ];

      diseaseLocations.forEach(({ lat, lng, disease, color }) => {
        new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance.current,
          title: disease,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 20,
            fillColor: color,
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: "black",
          },
          label: {
            text: disease,
            color: "black",
            fontSize: "12px",
            fontWeight: "bold",
          },
        });
      });

    
    };

    loadGoogleMapsScript()
      .then(() => {
        initMap();
      })
      .catch((error) => {
        console.error("Failed to load Google Maps script:", error);
      });

    return () => {
      const script = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (script) document.head.removeChild(script);
    };
  }, []);



  return (
    <div className="container">
      <div className="navbar">
        <Sidebar />
      </div>

      <div className="main">
        <div className="header">
          <h2>
            <i className="fa-solid fa-map-location-dot"></i> Geographic Health
            Insight
          </h2>
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

            {/* Map container */}
        <div style={{ height: "100vh" }}>
          <div
            id="style-selector-control"
            className="map-control"
          >
            <select
              id="style-selector"
              className="selector-control"
              aria-label="Map style"
            >
              <option value="default" selected>
                Default
              </option>
              <option value="silver">Silver</option>
              <option value="night">Night mode</option>
              <option value="retro">Retro</option>
            </select>
          </div>
          <div ref={mapRef} id="map" style={{ height: "100%" }}></div>
        </div>
      </div>

          {/* settings content */}
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

            {/* Sample output para makita if nag sasave yung admin account */}
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
  );
}

export default Maps;
