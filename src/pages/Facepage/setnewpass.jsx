import { Link } from "react-router-dom";
import './Frontpage.css';

const Setnewpass = () => {
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-box">
        <form className="forgot-password-form">
          <h1>Set New Password</h1>
          <h5>Enter your new password.
          Recommended length is 6 characters long.</h5>
          <div className="new-password-form">
                <label htmlFor="newpass">New Password:</label>
              <input type="text" id="newpass" name="newpass" required />
              <label htmlFor="confirmpass">Confirm New Password</label>
              <input type="text" id="confirmpass" name="confirmpass" required />
          </div>
        </form>
        <div>
            <h5>Make sure your password is strong and unique.</h5>
        </div>
        <Link to="/login">
        <button type="submit" className="reset-password-button">Set New Password</button>
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

export default Setnewpass;