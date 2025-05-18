import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Patient Pages
import Appointment from './pages/Patient/Appointment';
import Dashboard2 from './pages/Patient/Dashboard2';
import GeoMap from './pages/Patient/GeoMap';
import PatientRecord2 from './pages/Patient/Patient-Record';

// Access Control Wrapper
const ProtectedRoute = ({ children }) => {
  const isPatientAuthenticated = localStorage.getItem('context') === 'patient'; // Check if the context is patient

  if (!isPatientAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to the homepage if not authenticated
  }

  return children;
};

function PatientApp() {
  return (
    <div>
      <Routes>
        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard2"
          element={
            <ProtectedRoute>
              <Dashboard2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/geo-map"
          element={
            <ProtectedRoute>
              <GeoMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-record2"
          element={
            <ProtectedRoute>
              <PatientRecord2 />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default PatientApp;
