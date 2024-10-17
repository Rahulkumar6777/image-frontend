// src/components/AdminDashboard/AdminDashboard.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminUpload from '../AdminUpload/AdminUpload';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated by looking for a token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token is found, redirect to the login page
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove the token from localStorage on logout
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/" className="admin-home-link">Home</Link>
          <button onClick={handleLogout} className="admin-logout-button">Logout</button>
        </div>
      </header>
      <AdminUpload />
      {/* Future Admin functionalities can be added here */}
    </div>
  );
}

export default AdminDashboard;
