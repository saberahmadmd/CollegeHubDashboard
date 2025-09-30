const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all("SELECT * FROM reviews ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { college_name, rating, comment } = req.body;

  if (!college_name?.trim() || !rating || !comment?.trim()) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const query = "INSERT INTO reviews (college_name, rating, comment) VALUES (?, ?, ?)";
  db.run(query, [college_name.trim(), parseInt(rating), comment.trim()], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to add review' });
    }
    res.json({
      id: this.lastID,
      college_name: college_name.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      created_at: new Date().toISOString()
    });
  });
});

router.delete('/:id', (req, res) => {
  const reviewId = req.params.id;

  if (!reviewId) {
    return res.status(400).json({ error: 'Review ID is required' });
  }

  // First check if review exists
  db.get("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, review) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    db.run("DELETE FROM reviews WHERE id = ?", [reviewId], function (err) {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Failed to delete review' });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully',
        deletedId: reviewId,
        changes: this.changes
      });
    });
  });
});

router.get('/:id', (req, res) => {
  const reviewId = req.params.id;

  db.get("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, review) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  });
});

module.exports = router;
