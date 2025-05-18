import { useState } from "react";
import { Link } from "react-router-dom";
import './Frontpage.css';

const Register = () => {


  const [formData, setFormData] = useState({
    familyId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const { familyId, name, email, password, confirmPassword, phoneNumber } = formData;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const isFormComplete =
    familyId &&
    name &&
    email &&
    password &&
    confirmPassword &&
    phoneNumber &&
    password === confirmPassword;

  const handleSubmit = () => {
    if (isFormComplete) {
      alert("Form submitted successfully!");
    } else {
      alert("Please complete all fields correctly.");
    }
  };
  return (
    
    <div className="register-page">
      
      <div className="Register-Page-Box">

        <form className="register-form" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <div>
          <label htmlFor="name">Family ID:</label>
          <input type="text" id="familyId" name="fanID" placeholder="enter your family id" required onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" className="yname" placeholder="enter your name" required onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="name">Gmail:</label>
          <input type="text" id="email" className="input-field" placeholder="enter your gmail" required onChange={handleInputChange} />
        </div>

      <div>
        <label htmlFor="name">Password:</label>
        <input type="password" id="password" className="paswsword" placeholder="enter your password" required onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="name">Confirm Password:</label>
        <input type="password" id="confirmPassword" className="cpassword" placeholder="confirm your password" required onChange={handleInputChange} />
      </div>

      <div>
        <label htmlFor="name">Contact Number:</label>
        <input type="text" id="phoneNumber" className="contactnum" placeholder="enter phone number" required onChange={handleInputChange} />
      </div>
      <button type="submit" className="register-button">Register</button>

      <div className="addlinks">
          <span>
          Already have an account?{" "}
              <Link to="/logintwo" className="logintwo-link">Log in now!</Link>
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

export default Register;
