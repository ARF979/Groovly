const express = require('express');
const { searchTracks, getTrack, getRecommendations } = require('../controllers/spotifyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/search', protect, searchTracks);
router.get('/track/:id', protect, getTrack);
router.get('/recommendations/:id', protect, getRecommendations);

module.exports = router;
