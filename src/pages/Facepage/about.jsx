import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import './Frontpage.css';

export const About2 = () => {
  return (
    <div>
    <div className="about-container">
      <div className="location">
        <h2>
            <i className="fa-solid fa-location-dot fa-2x"></i>
            <a href="https://maps.app.goo.gl/mybv9CUDN3AfE9ck8">
            Karangalan Health Center j454+jmg, Darangalan Dr, Cainta, 1900 Rizal
            </a>
        </h2>
      </div> 

      <div className="facebook"> 
      <h2>
        <i className="fa-brands fa-facebook fa-2x"></i>
          <a href="https://www.facebook.com/drcaalim">
            Karangalan Health Center
          </a>
      </h2>
        
      </div>
      <div className="service">
      <h2>
        <i className="fa-solid fa-suitcase-medical fa-2x"></i>
        <span>Available Service:</span> 
        <span>Check-Up, Dental, Vaccine, Maternal</span>
      </h2>
        
      </div>

      <div className="hours"> 
      <h2>
        <i className="fa-solid fa-business-time fa-2x"></i>
        <span>Monday to Friday</span>
        <span>9:00 A.M. - 5:00 P.M.</span>
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

const About = () => {
  return (
    <div className="about-page">
      <Link to="/">
        <h1 className="about-page-about-us">About Us</h1>
      </Link>
      <About2 />
    </div>
  );
};

export default About;
