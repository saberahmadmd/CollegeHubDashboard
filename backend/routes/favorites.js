const express = require('express');
const router = express.Router();
const db = require('../database');

// Get favorites
router.get('/', (req, res) => {
  const query = `
    SELECT c.* 
    FROM colleges c 
    INNER JOIN favorites f ON c.id = f.college_id 
    ORDER BY c.name
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }
    res.json(rows || []);
  });
});

// Add to favorites
router.post('/', (req, res) => {
  const { college_id } = req.body;

  if (!college_id) {
    return res.status(400).json({ error: 'College ID is required' });
  }

  // Check if college exists
  db.get("SELECT id FROM colleges WHERE id = ?", [college_id], (err, college) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    // Check if already in favorites
    db.get("SELECT id FROM favorites WHERE college_id = ?", [college_id], (err, existing) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existing) {
        return res.status(400).json({ error: 'College already in favorites' });
      }

      db.run("INSERT INTO favorites (college_id) VALUES (?)", [college_id], function (err) {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Failed to add to favorites' });
        }
        res.json({ id: this.lastID, college_id });
      });
    });
  });
});

// Remove from favorites
router.delete('/:college_id', (req, res) => {
  const college_id = req.params.college_id;

  db.run("DELETE FROM favorites WHERE college_id = ?", [college_id], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to remove from favorites' });
    }
    res.json({ message: 'Removed from favorites', changes: this.changes });
  });
});

module.exports = router;