import React from 'react';
import { Link } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  return (
    <div className="logout-page">
      <div className="logout-container">
        <h1 className="logout-title">You have been logged out</h1>
        <p className="logout-message">
          Thank you for using CollegeHub. We hope to see you again soon!
        </p>
        <div className="logout-actions">
          <Link to="/" className="logout-home-button">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;