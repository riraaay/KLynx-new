
import Map from './map.jsx';
import Navbar from './navbar.jsx';
import './GeoMap.css';

function GeoMap() {
  return (
    <div className="geo-map-container">
      <div className="geo-nav">
        <Navbar />
      </div>

      <div className="geo-map">
        <Map />
      </div>
    </div>
  );
}

export default GeoMap;
