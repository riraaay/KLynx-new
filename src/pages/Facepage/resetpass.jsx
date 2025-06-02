import { Link } from "react-router-dom";
import './Frontpage.css';

const Resetpass = () => {
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-box">
        <form className="forgot-password-form">
          <h1>Reset Password</h1>
          <h5>How do you want to get the code to reset your password?</h5>
          <div className="radio-buttons">
            <form className="radio-form">
             <input type="radio" value="email" id="email" name="reset"/>
             <label htmlFor="email">Email Address</label><br/>
            
             <input type="radio" value="sms" id="sms" name="reset"/>
             <label htmlFor="sms">Contact Number</label><br/>
             </form>
          </div>
        </form>
        <Link  to="/entercode">
        <button type="submit" className="reset-password-button">Send Code</button>
        </Link>
      </div>
      <div className="Return-Home-Button">
              <Link to="/">
                <button>Back</button>
              </Link>
              </div>
      
    </div>
  );
};

export default Resetpass;