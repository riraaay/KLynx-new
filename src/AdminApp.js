import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import Consultation from './pages/Admin/Consultation';
import Patientrecord from './pages/Admin/Patientrecord';
import Dashboard from './pages/Admin/Dashboard';
import Maps from './pages/Admin/Maps';

// CSS Files
import "./pages/Admin/consult.css";

// Access Control Wrapper
const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem('context') === 'admin'; // Check if the context is admin

  if (!isAdminAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to the homepage if not authenticated
  }

  return children;
};

function AdminApp() {
  return (
    <div>
      <Routes>
        <Route
          path="/consultation"
          element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patientrecord"
          element={
            <ProtectedRoute>
              <Patientrecord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maps"
          element={
            <ProtectedRoute>
              <Maps />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default AdminApp;
