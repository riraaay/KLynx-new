import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Frontpage.css';

const Login = ({ onLogin = () => {} }) => {

  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  });
//  const [username, setUsername] = useState('');
//  const [password, setPassword] = useState('');

  const [error, setError] = useState("");
  const navigate = useNavigate();

//  const predefinedUsername = "user123";  // Set your desired username
//  const predefinedPassword = "password123";  // Set your desired password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
 
    try{
      const response = await fetch("http://localhost/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
      });

      const data = await response.json();

      if(data.status === 1){
        onLogin("admin");
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch(err) {
      console.error("Login error:", err);
      setError("Something went wrong while connecting to the server");
    }
    
  };


/*
        // Check if username and password match predefined values
        if (username === predefinedUsername && password === predefinedPassword) 
        {
          console.log("Login successful");
          onLogin('admin');
          navigate("/dashboard");  // Navigate to the dashboard
        } 
        else
        {
          setError("Invalid username or password");
        }

  };*/

  return (
  <div className="login-page">
    <div className="Login-Page-Box">
      
      <form className="login-form" onSubmit={handleSubmit}>
      <h1>Welcome, Admin!</h1>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="login-button-admin">Login</button>
      </form>
      <div>
        <Link to="/forgot-password" className="addlinks-admin">Forgot Password?</Link>
      </div>
    </div>
    <div className="Return-Home-Button">
    <Link to="/">
      <button>Back</button>
    </Link>
    </div>
  </div>
  );
};

export default Login;