import { useState } from "react";
import PropTypes from 'prop-types';

import { Link, useNavigate } from "react-router-dom";
import './Frontpage.css';

const Logintwo = ({onLogin}) => {
  const [familyID, setFamilyID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const predefinedFamilyID = "123456";
  const predefinedPassword = "password123";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!familyID || !password) 
        {
          setError("Family ID and password are required");
          return;
        }
    
        if (!/^\d/.test(familyID)) 
        {
          setError("Error: FamilyID mismatched.");
        } 

        if (familyID === predefinedFamilyID && password === predefinedPassword) {
          console.log("Login successful");
          onLogin && onLogin('admin');
          navigate("/Patient-Dashboard"); // Navigate to the dashboard
        } else {
          setError("Invalid Family ID or password");
        }
      };

  return (
    <div className="login-page">
    <div className="Login-Page-Box">
      <h1>Log in</h1>
      <form className="login-form" onSubmit={handleSubmit}>

        <div>
          <label htmlFor="familyID">Family ID:</label>
          <input
            type="text"
            id="familyID"
            name="familyID"
            value={familyID}
            onChange={(e) => setFamilyID(e.target.value)}
            required
          />
          {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button-patient">Log In</button>

        <div className="addlinks-patient">
            <span>
                Don&apos;t have an account?{" "}
                <Link to="/register" className="register-link-patient">Register now!</Link>
            </span>
            <span className="addlinks-patient2">
                <Link to="/Forgot-Password" className="forgot-password-link-patient">Forgot Password?</Link>
            </span>
        </div>

        
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
Logintwo.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Logintwo;


