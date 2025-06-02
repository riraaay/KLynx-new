import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Front Pages
import Frontpage from './pages/Facepage/Frontpage';
import Login from './pages/Facepage/login';
import Login2 from './pages/Facepage/logintwo';
import Register from './pages/Facepage/register';
import ForgotPassword from './pages/Facepage/ForgotPassword';
import About from './pages/Facepage/about';
import Contact from './pages/Facepage/contact';

// CSS Files
import "./pages/Facepage/Frontpage.css";

function FrontApp({ onLogin }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/logintwo" element={<Login2 onLogin={onLogin}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
export default FrontApp;