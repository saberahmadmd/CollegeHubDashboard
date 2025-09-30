const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();

    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      throw new Error('Backend server is not responding properly. Please ensure the backend is running on port 5000.');
    }

    throw new Error(`Server returned unexpected response: ${text.substring(0, 100)}`);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout - backend server may be down')), timeout)
    )
  ]);
};

export const api = {
  getColleges: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });

    const response = await fetchWithTimeout(`${API_BASE_URL}/colleges?${queryParams}`);
    return handleResponse(response);
  },

  getFilterOptions: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/colleges/filters`);
    return handleResponse(response);
  },

  getReviews: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/reviews`);
    return handleResponse(response);
  },

  addReview: async (reviewData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return handleResponse(response);
  },

  deleteReview: async (reviewId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  getFavorites: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/favorites`);
    return handleResponse(response);
  },

  addFavorite: async (collegeId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ college_id: collegeId })
    });
    return handleResponse(response);
  },

  removeFavorite: async (collegeId) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/favorites/${collegeId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};