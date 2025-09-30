import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="navigation">
      <div className="navigation-container">
        <div className="navigation-logo">
          <Link to="/">🎓 CollegeHub</Link>
        </div>
        <div className="navigation-items">
          <Link to="/" className="navigation-link">Home</Link>
          <Link to="/colleges" className="navigation-link">Colleges</Link>
          <Link to="/reviews" className="navigation-link">Reviews</Link>
          <Link to="/favorites" className="navigation-link">Favorites</Link>
          <Link to="/logout" className="navigation-link">Logout</Link>
          <button
            className="theme-toggle-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;