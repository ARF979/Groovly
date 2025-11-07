const express = require('express');
const router = express.Router();
const { searchSongs } = require('../controllers/youtubeController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchSongs);

module.exports = router;
