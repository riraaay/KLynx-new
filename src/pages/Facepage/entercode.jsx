import { Link } from "react-router-dom";
import './Frontpage.css';

const Entercode = () => {
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-box">
        <form className="forgot-password-form">
          <h1>Enter Code</h1>
          <h5>Please check your email or SMS for a message with your code. </h5>
          <div>
              <input type="text" id="code" name="code" required />
          </div>
        </form>
        <div>
            <h5>Didn&apos;t receive the code? <Link to="/resetpass" className="addlinks-admin">Resend Code</Link></h5>
        </div>

        <Link to="/setnewpass">
        <button type="submit" className="reset-password-button">Continue</button>
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

export default Entercode;