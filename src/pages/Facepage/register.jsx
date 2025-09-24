import { useState } from "react";
import { Link } from "react-router-dom";
import './Frontpage.css';
import axios from "axios";

const Register = () => {

  const [inputs, setInputs] = useState({ gender: "female" });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}));
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    axios.post('http://localhost/api/register2.php', inputs);
  }

  return (
    
    <div className="register-page">
      
      <div className="Register-Page-Box"> {/*the white box*/}
        <h1>Create your account</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-column">
              <div className="register-input-box">
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="fName" placeholder="Enter your first name" required onChange={handleChange} />    
              </div>
              <div className="register-input-box">
                <label htmlFor="middleName">Middle Name:</label>
                <input type="text" id="middleName" name="mName" placeholder="Enter your middle name" required onChange={handleChange} />
              </div>
              <div className="register-input-box">
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lName" placeholder="Enter your last name" required onChange={handleChange} />
              </div>
            </div>
            <div className="register-column">
              <div className="register-input-box">
                <div className="register-gender-box">
                  <h3>Gender:</h3>
                  <div className="register-gender-option">
                    <div className="register-gender">
                      <input type="radio" id="check-male" name="gender" checked={inputs.gender === "male"} value="male" onChange={handleChange}/>
                      <label htmlFor="check-male">Male</label>                  
                    </div>
                    <div className="register-gender">
                      <input type="radio" id="check-female" name="gender" checked={inputs.gender === "female"} value="female" onChange={handleChange}/>
                      <label htmlFor="check-female">Female</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="register-input-box">
                <label>Marital Status:</label>
                <div className="register-select-box">
                  <select name="maritalStatus" onChange={handleChange} required>
                    <option hidden></option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorce">Divorce</option>
                    <option value="separated">Separated</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
              <div className="register-input-box">
                <label htmlFor="birthdate">Birthdate:</label>
                <input type="date" id="birthdate" name="bdate" placeholder="Enter your birth date" required onChange={handleChange} />    
              </div>
            </div>
            <div className="register-column">
                <div className="register-input-box">
                  <label htmlFor="homeaddress">Home Address:</label>
                  <input type="text" id="homeaddress" name="homeadd" placeholder="Enter your first name" required onChange={handleChange} />    
                </div>
              <div className="register-input-box">
                <label>Street:</label>
                <div className="register-select-box">
                  <select name="street" onChange={handleChange} required>
                    <option hidden></option>
                    <option value="kayumanggi">Kayumanggi</option>
                    <option value="karunungan">Karunungan</option>
                    <option value="kalinisan">Kalinisan</option>
                    <option value="katapangan">Katapangan</option>
                    <option value="kagitingan">Kagitingan</option>
                    <option value="katatagan">Katatagan</option>
                    <option value="karangalan">Karangalan</option>
                    <option value="katapatan">Katapatan</option>
                    <option value="kasipagan">Kasipagan</option>
                    <option value="kahusayan">Kahusayan</option>
                    <option value="kabutihan">Kabutihan</option>
                    <option value="katalinuhan">Katalinuhan</option>
                    <option value="kabanalan">Kabanalan</option>
                    <option value="kaayusan">Kaayusan</option>
                    <option value="kabayanihan">Kabayanihan</option>
                    <option value="kalayaan">Kalayaan</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="register-column">
              <div className="register-input-box">
                <label htmlFor="contactNumber">Contact Number:</label>
                <input type="text" id="contactNumber" name="contactNum" placeholder="Enter your first name" required onChange={handleChange} />    
              </div>
              <div className="register-input-box">
                <label htmlFor="emergencyContact">Emergency Contact Number:</label>
                <input type="text" id="emergencyContact" name="ecNumber" placeholder="Enter your middle name" required onChange={handleChange} />
              </div>
              <div className="register-input-box">
                <label htmlFor="FamID">Family ID:</label>
                <input type="text" id="FamID" name="famID" placeholder="Enter your last name" required onChange={handleChange} />
              </div>
            </div>
            <div className="register-column">
              <div className="register-input-box">
                <label htmlFor="email">Email Address:</label>
                <input type="text" id="Email" name="email" placeholder="Enter your first name" required onChange={handleChange} />    
              </div>
              <div className="register-input-box">
                <label htmlFor="pass">Password:</label>
                <input type="text" id="pass" name="user_password" placeholder="Enter your password" required onChange={handleChange} />    
              </div>
            </div>
            <div className="register-column-last">
              <p className="register-already">Already have an account?{' '}<Link to="/Logintwo" className="register-redirect-login">Log In now!</Link>

              </p>
            </div>
            <button className="register-button">Register</button>
            
        {/*<div>
          
          
        </div>
        
        <div>
          <label htmlFor="name">Gmail:</label>
          <input type="text" id="email" name="gmail" className="input-field" placeholder="enter your gmail" required onChange={handleChange} />
        </div>

      <div>
        <label htmlFor="name">Password:</label>
        <input type="password" id="password" name="pwd" className="paswsword" placeholder="enter your password" required onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="name">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="matchPwd" className="cpassword" placeholder="confirm your password" required onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="name">Contact Number:</label>
        <input type="text" id="phoneNumber" name="contactNum" className="contactnum" placeholder="enter phone number" required onChange={handleChange} />
      </div>
      <button type="submit" className="register-button">Register</button>

      <div className="addlinks">
          <span>
          Already have an account?{" "}
              <Link to="/logintwo" className="logintwo-link">Log in now!</Link>
          </span>
      </div> */}
      
      </form>

    </div>
        {/*<div className="">
        <Link to="/">
          <button>Back</button>
        </Link>
        </div> */}
    </div>
  );
};

export default Register;
