import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import './Frontpage.css';

const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState(''); 
  const [error, setError] = useState(""); 
  const Navigate = useNavigate();

  const predefinedEmail = "user123@gmail.com";  
  const predefinedMobile = "09123456789";  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email && !mobile) {
      setError("Email or mobile number is required");
      return;
    }

    if (email === predefinedEmail || mobile === predefinedMobile) {
      console.log("Account found");
    //  onSearch && onSearch('admin'); 
      Navigate("/resetpass"); // Navigate to the Enter Code page
    } else {
      setError("Invalid email or mobile number");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-box" > 
         <h1>Find your Account</h1>
          <h5>Please enter your email or mobile number to search for your account.</h5>
       
        <form className="forgot-password-form" onSubmit={handleSubmit}>
        
          <div>
              <input 
              type="text" 
              id="number" 
              name="number" 
              placeholder="Email Address or Contact Number" 
              value={email || mobile}
              onChange={(e) => {
                if (e.target.value.includes('@')) {
                  setEmail(e.target.value);
                  setMobile('');
                } else {
                  setMobile(e.target.value);
                  setEmail('');
                }
              }}
              required />
              {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
          </div>
       
        <button type="submit" className="reset-password-button">Search</button>
         </form>

      </div>
      <div className="Return-Home-Button">
              <Link to="/">
                <button>Back</button>
              </Link>
              </div>
      
    </div>
  );
};

ForgotPassword.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
export default ForgotPassword;