import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import './Colleges.css';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [filters, setFilters] = useState({
    location: 'all',
    course: 'all',
    minFee: '',
    maxFee: '',
    search: '',
    sort: 'name'
  });
  const [filterOptions, setFilterOptions] = useState({
    locations: ['Hyderabad', 'Bangalore', 'Chennai'],
    courses: ['Computer Science', 'Electronics', 'MBA', 'MBBS', 'Law', 'BSc Physics']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  const checkBackendStatus = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
      if (response.ok) {
        setBackendStatus('connected');
        return true;
      } else {
        setBackendStatus('error');
        return false;
      }
    } catch (error) {
      setBackendStatus('error');
      return false;
    }
  }, []);

  const fetchColleges = useCallback(async () => {
    if (backendStatus !== 'connected') return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getColleges(filters);
      setColleges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [filters, backendStatus]);

  const fetchFilterOptions = useCallback(async () => {
    if (backendStatus !== 'connected') return;

    try {
      const data = await api.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, [backendStatus]);

  useEffect(() => {
    const initializeApp = async () => {
      const isBackendConnected = await checkBackendStatus();
      if (isBackendConnected) {
        await fetchFilterOptions();
        await fetchColleges();
      }
    };
    initializeApp();
  }, [checkBackendStatus, fetchFilterOptions, fetchColleges]);

  useEffect(() => {
    if (backendStatus === 'connected') {
      fetchColleges();
    }
  }, [fetchColleges, backendStatus]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: 'all',
      course: 'all',
      minFee: '',
      maxFee: '',
      search: '',
      sort: 'name'
    });
  };

  const addToFavorites = async (collegeId) => {
    if (backendStatus !== 'connected') {
      alert('Backend server is not connected. Please start the backend server.');
      return;
    }

    try {
      await api.addFavorite(collegeId);
      alert('Added to favorites!');
    } catch (err) {
      alert(err.message);
    }
  };

  const formatFee = (fee) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(fee);
  };

  const retryConnection = async () => {
    setBackendStatus('checking');
    setError(null);
    const isConnected = await checkBackendStatus();
    if (isConnected) {
      await fetchFilterOptions();
      await fetchColleges();
    }
  };

  if (backendStatus === 'checking') {
    return (
      <div className="colleges-page">
        <div className="backend-status">
          <h2>Checking backend connection...</h2>
          <p>Please ensure the backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'error') {
    return (
      <div className="colleges-page">
        <div className="backend-error">
          <h2>Backend Server Not Connected</h2>
          <p>Unable to connect to the backend server. Please make sure:</p>
          <ul>
            <li>Backend server is running on port 5000</li>
            <li>You have run `npm start` in the backend directory</li>
            <li>There are no other applications using port 5000</li>
          </ul>
          <button onClick={retryConnection} className="retry-connection-button">
            Retry Connection
          </button>
          <div className="offline-mode">
            <h3>Default Colleges (Offline Mode)</h3>
            <div className="colleges-grid">
              {[
                { id: 1, name: 'ABC Engineering College', location: 'Hyderabad', course: 'Computer Science', fee: 120000 },
                { id: 2, name: 'XYZ Institute of Technology', location: 'Bangalore', course: 'Electronics', fee: 100000 },
                { id: 3, name: 'Sunrise Business School', location: 'Chennai', course: 'MBA', fee: 150000 }
              ].map(college => (
                <div key={college.id} className="colleges-card">
                  <h3 className="colleges-card-title">{college.name}</h3>
                  <div className="colleges-card-details">
                    <p><strong>Location:</strong> {college.location}</p>
                    <p><strong>Course:</strong> {college.course}</p>
                    <p><strong>Fee:</strong> {formatFee(college.fee)}</p>
                  </div>
                  <button
                    className="colleges-favorite-button"
                    onClick={() => alert('Backend server required for this feature')}
                  >
                    ⭐ Add to Favorites
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="colleges-page">
      <h1 className="colleges-title">Colleges Directory</h1>

      <div className="colleges-filters">
        <div className="colleges-filter-group">
          <label className="colleges-filter-label">Search</label>
          <input
            type="text"
            className="colleges-filter-input"
            placeholder="Search by college name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="colleges-filter-group">
          <label className="colleges-filter-label">Location</label>
          <select
            className="colleges-filter-select"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="all">All Locations</option>
            {filterOptions.locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="colleges-filter-group">
          <label className="colleges-filter-label">Course</label>
          <select
            className="colleges-filter-select"
            value={filters.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <option value="all">All Courses</option>
            {filterOptions.courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <div className="colleges-filter-group">
          <label className="colleges-filter-label">Min Fee</label>
          <input
            type="number"
            className="colleges-filter-input"
            placeholder="Min fee"
            value={filters.minFee}
            onChange={(e) => handleFilterChange('minFee', e.target.value)}
          />
        </div>

        <div className="colleges-filter-group">
          <label className="colleges-filter-label">Max Fee</label>
          <input
            type="number"
            className="colleges-filter-input"
            placeholder="Max fee"
            value={filters.maxFee}
            onChange={(e) => handleFilterChange('maxFee', e.target.value)}
          />
        </div>

        <div className="colleges-filter-group">
          <label className="colleges-filter-label">Sort By</label>
          <select
            className="colleges-filter-select"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="name">Name</option>
            <option value="fee_low">Fee: Low to High</option>
            <option value="fee_high">Fee: High to Low</option>
          </select>
        </div>

        <div className="colleges-filter-group">
          <label className="colleges-filter-label">&nbsp;</label>
          <button
            className="colleges-clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="colleges-loading">Loading colleges...</div>
      ) : error ? (
        <div className="error-message">
          <h3>Error Loading Colleges</h3>
          <p>{error}</p>
          <button onClick={fetchColleges} className="colleges-retry-button">
            Try Again
          </button>
        </div>
      ) : colleges.length === 0 ? (
        <div className="colleges-no-results">
          <h3>No colleges found matching your criteria</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="colleges-grid">
          {colleges.map(college => (
            <div key={college.id} className="colleges-card">
              <h3 className="colleges-card-title">{college.name}</h3>
              <div className="colleges-card-details">
                <p><strong>Location:</strong> {college.location}</p>
                <p><strong>Course:</strong> {college.course}</p>
                <p><strong>Fee:</strong> {formatFee(college.fee)}</p>
              </div>
              <button
                className="colleges-favorite-button"
                onClick={() => addToFavorites(college.id)}
              >
                ⭐ Add to Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Colleges;