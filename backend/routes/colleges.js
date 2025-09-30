const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all colleges with filters
router.get('/', (req, res) => {
  const { location, course, minFee, maxFee, search, sort } = req.query;

  let query = `SELECT * FROM colleges WHERE 1=1`;
  const params = [];

  if (location && location !== 'all') {
    query += ' AND location = ?';
    params.push(location);
  }

  if (course && course !== 'all') {
    query += ' AND course = ?';
    params.push(course);
  }

  if (minFee) {
    query += ' AND fee >= ?';
    params.push(parseInt(minFee));
  }

  if (maxFee) {
    query += ' AND fee <= ?';
    params.push(parseInt(maxFee));
  }

  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  if (sort === 'fee_low') {
    query += ' ORDER BY fee ASC';
  } else if (sort === 'fee_high') {
    query += ' ORDER BY fee DESC';
  } else {
    query += ' ORDER BY name ASC';
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch colleges' });
    }
    res.json(rows || []);
  });
});

// Get filter options
router.get('/filters', (req, res) => {
  db.all("SELECT DISTINCT location FROM colleges ORDER BY location", (err, locationRows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch locations' });
    }

    db.all("SELECT DISTINCT course FROM colleges ORDER BY course", (err, courseRows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch courses' });
      }

      res.json({
        locations: locationRows.map(row => row.location),
        courses: courseRows.map(row => row.course)
      });
    });
  });
});

module.exports = router;