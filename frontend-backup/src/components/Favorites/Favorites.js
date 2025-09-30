import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (collegeId, collegeName) => {
    if (!window.confirm(`Are you sure you want to remove ${collegeName} from favorites?`)) {
      return;
    }

    setRemoving(collegeId);
    try {
      await api.removeFavorite(collegeId);
      setFavorites(prev => prev.filter(college => college.id !== collegeId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert(`Failed to remove from favorites: ${err.message}`);
    } finally {
      setRemoving(null);
    }
  };

  const formatFee = (fee) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(fee);
  };

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">My Favorite Colleges</h1>

      {loading ? (
        <div className="favorites-loading">
          <div className="loading-spinner"></div>
          Loading your favorite colleges...
        </div>
      ) : error ? (
        <div className="favorites-error">
          <h3 className="favorites-error-title">Unable to Load Favorites</h3>
          <p className="favorites-error-text">{error}</p>
          <div className="favorites-error-actions">
            <button onClick={fetchFavorites} className="favorites-retry-button">
              Try Again
            </button>
            <p className="favorites-error-help">
              Make sure your backend server is running on port 5000
            </p>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">⭐</div>
          <h3 className="favorites-empty-title">No Favorite Colleges Yet</h3>
          <p className="favorites-empty-text">
            Start browsing colleges and click the "Add to Favorites" button
            to save them here for easy access.
          </p>
          <a href="/colleges" className="favorites-browse-link">
            Browse Colleges
          </a>
        </div>
      ) : (
        <>
          <div className="favorites-summary">
            <p>You have {favorites.length} favorite college{favorites.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="favorites-grid">
            {favorites.map(college => (
              <div key={college.id} className="favorites-card">
                <div className="favorites-card-badge">⭐ Favorite</div>
                <h3 className="favorites-card-title">{college.name}</h3>
                <div className="favorites-card-details">
                  <div className="favorites-detail-item">
                    <strong>Location:</strong> {college.location}
                  </div>
                  <div className="favorites-detail-item">
                    <strong>Course:</strong> {college.course}
                  </div>
                  <div className="favorites-detail-item">
                    <strong>Annual Fee:</strong> {formatFee(college.fee)}
                  </div>
                </div>
                <button
                  className={`favorites-remove-button ${removing === college.id ? 'removing' : ''}`}
                  onClick={() => removeFromFavorites(college.id, college.name)}
                  disabled={removing === college.id}
                >
                  {removing === college.id ? 'Removing...' : 'Remove from Favorites'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;