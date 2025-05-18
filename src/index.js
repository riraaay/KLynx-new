import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FrontApp from './FrontApp';
import AdminApp from './AdminApp';
import PatientApp from './PatientApp';

const ProtectedRoute = ({ children, allowedContext, context }) => {
  if (context !== allowedContext) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [context, setContext] = useState(() => localStorage.getItem('context') || 'front');
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === 'admin') {
      setContext('admin');
      localStorage.setItem('context', 'admin');
      navigate('/admin');
    } else if (role === 'patient') {
      setContext('patient');
      localStorage.setItem('context', 'patient');
      navigate('/patient');
    }
  };

  const handleLogout = () => {
    setContext('front');
    localStorage.removeItem('context');
    navigate('/');
  };

  return (
    <Routes>
      {context === 'front' && <Route path="/*" element={<FrontApp onLogin={handleLogin} />} />}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedContext="admin" context={context}>
            <AdminApp onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedContext="patient" context={context}>
            <PatientApp onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);