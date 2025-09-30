import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">Welcome to CollegeHub</h1>
          <p className="home-description">
            Discover the perfect college for your future. Browse through our extensive
            database of colleges, read reviews from students, and save your favorites.
          </p>
          <div className="home-features">
            <div className="home-feature-grid">
              <div className="home-feature-card">
                <h3 className="home-feature-title">🎓 Browse Colleges</h3>
                <p className="home-feature-text">Explore colleges with advanced filters and search</p>
              </div>
              <div className="home-feature-card">
                <h3 className="home-feature-title">⭐ Save Favorites</h3>
                <p className="home-feature-text">Bookmark your preferred colleges for easy access</p>
              </div>
              <div className="home-feature-card">
                <h3 className="home-feature-title">💬 Read Reviews</h3>
                <p className="home-feature-text">Get insights from student reviews and ratings</p>
              </div>
            </div>
          </div>
          <Link to="/colleges" className="home-get-started-button">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;