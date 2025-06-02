
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import './Frontpage.css';

export const Contact2 = () => {
  return (
    <div>
    <div className="contact-container">
      <div className="contact-page-email">
        <h2>
        <i className="fa-solid fa-envelope fa-2x"></i>
          <span>Karangalan Email</span>
          <span>karangalancenter2015@yahoo.com</span>
        </h2>
      </div> 

      <div className="facebook"> 
      <h2>
      <i className="fa-solid fa-circle-h fa-2x"></i>
        <a href="https://www.facebook.com/share/p/RrZem4a8hi9pN8Uv/">
          <span>HOTLINES</span>
          </a>
        <div id="Hotline1">
          <i className="fa-solid fa-tower-broadcast fa-1x"></i>
            <span>8535-0131</span>
        </div>

        <div id="Hotline2">
          <i className="fa-solid fa-house-fire fa-1x"></i>
          <span>8696-2616</span>
        </div>

        <div id="Hotline3">
          <i className="fa-solid fa-hospital fa-1x"></i>
          <span>8535-2605</span>
        </div>
      </h2>
        
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

const Contact = () => {
  return (
    <div className="contact-page">
      <Link to="/">
        <h1 className="contact-page-contact">Contact</h1>
      </Link>
      <Contact2 />
    </div>
  );
};

export default Contact;
