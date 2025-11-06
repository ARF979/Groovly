const express = require('express');
const { body } = require('express-validator');
const {
  addSong,
  upvoteSong,
  downvoteSong,
  skipSong,
  removeSong
} = require('../controllers/songController');
const { protect } = require('../middleware/auth');
const { checkRoomMember } = require('../middleware/roomAuth');
const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

// Validation rules
const addSongValidation = [
  body('spotifyId').trim().notEmpty().withMessage('Spotify ID is required'),
  body('title').trim().notEmpty().withMessage('Song title is required'),
  body('artist').trim().notEmpty().withMessage('Artist name is required'),
  body('durationMs').isInt({ min: 0 }).withMessage('Valid duration is required'),
  validate
];

// Routes
router.post('/', protect, checkRoomMember, addSongValidation, addSong);
router.post('/:songId/upvote', protect, checkRoomMember, upvoteSong);
router.post('/:songId/downvote', protect, checkRoomMember, downvoteSong);
router.post('/:songId/skip', protect, checkRoomMember, skipSong);
router.delete('/:songId', protect, checkRoomMember, removeSong);

module.exports = router;
