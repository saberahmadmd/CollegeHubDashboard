import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    college_name: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.college_name.trim() || !formData.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.addReview(formData);
      // Refresh reviews after successful submission
      await fetchReviews();
      setFormData({ college_name: '', rating: 5, comment: '' });
      alert('Review added successfully!');
    } catch (err) {
      console.error('Error adding review:', err);
      alert(`Failed to add review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId, collegeName) => {
    if (!window.confirm(`Are you sure you want to delete your review for ${collegeName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(reviewId);
    try {
      await api.deleteReview(reviewId);
      // Remove the review from local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      alert('Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(`Failed to delete review: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-title">College Reviews</h1>

      <div className="reviews-form-container">
        <h2 className="reviews-form-title">Add Your Review</h2>
        <form onSubmit={handleSubmit} className="reviews-form">
          <div className="reviews-form-group">
            <label className="reviews-form-label">College Name *</label>
            <input
              type="text"
              name="college_name"
              className="reviews-form-input"
              value={formData.college_name}
              onChange={handleChange}
              required
              placeholder="Enter college name"
              disabled={submitting}
            />
          </div>

          <div className="reviews-form-group">
            <label className="reviews-form-label">Rating *</label>
            <select
              name="rating"
              className="reviews-form-select"
              value={formData.rating}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>

          <div className="reviews-form-group">
            <label className="reviews-form-label">Comment *</label>
            <textarea
              name="comment"
              className="reviews-form-textarea"
              rows="4"
              value={formData.comment}
              onChange={handleChange}
              required
              placeholder="Share your experience with this college..."
              disabled={submitting}
            ></textarea>
          </div>

          <button
            type="submit"
            className="reviews-submit-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="reviews-list">
        <div className="reviews-list-header">
          <h2 className="reviews-list-title">Student Reviews</h2>
          {reviews.length > 0 && (
            <span className="reviews-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {loading ? (
          <div className="reviews-loading">
            <div className="loading-spinner"></div>
            Loading reviews...
          </div>
        ) : error ? (
          <div className="reviews-error">
            <h3>Unable to Load Reviews</h3>
            <p>{error}</p>
            <div className="reviews-error-actions">
              <button onClick={fetchReviews} className="reviews-retry-button">
                Try Again
              </button>
              <p className="reviews-error-help">
                Make sure your backend server is running on port 5000
              </p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            <div className="reviews-empty-icon">💬</div>
            <h3>No Reviews Yet</h3>
            <p>Be the first to share your experience with a college!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="reviews-card">
                <div className="reviews-card-header">
                  <div className="reviews-college-info">
                    <h3 className="reviews-college-name">{review.college_name}</h3>
                    <div className="reviews-rating" title={`${review.rating} out of 5 stars`}>
                      {renderStars(review.rating)}
                      <span className="reviews-rating-text">({review.rating}/5)</span>
                    </div>
                  </div>
                  <button
                    className={`reviews-delete-button ${deletingId === review.id ? 'deleting' : ''}`}
                    onClick={() => handleDeleteReview(review.id, review.college_name)}
                    disabled={deletingId === review.id}
                    title="Delete this review"
                  >
                    {deletingId === review.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
                <p className="reviews-comment">{review.comment}</p>
                <div className="reviews-footer">
                  <small className="reviews-date">
                    Posted on {formatDate(review.created_at)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;