require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./database');
const collegesRoutes = require('./routes/colleges');
const reviewsRoutes = require('./routes/reviews');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://college-hub-dashboard.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/colleges', collegesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', favoritesRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    message: 'College Dashboard API is running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🎓 Colleges API: http://localhost:${PORT}/api/colleges`);
  console.log(`💬 Reviews API: http://localhost:${PORT}/api/reviews`);
  console.log(`⭐ Favorites API: http://localhost:${PORT}/api/favorites`);
});

module.exports = app;
