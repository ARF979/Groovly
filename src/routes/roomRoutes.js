const express = require('express');
const { body } = require('express-validator');
const {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  closeRoom,
  updateRoomSettings,
  getRoomQueue,
  getRoomHistory
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { checkRoomMember, checkRoomHost } = require('../middleware/roomAuth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const createRoomValidation = [
  body('name').trim().notEmpty().withMessage('Room name is required')
    .isLength({ max: 50 }).withMessage('Room name cannot exceed 50 characters'),
  body('mode').optional().isIn(['democratic', 'dj-mode', 'auto-play'])
    .withMessage('Invalid room mode'),
  validate
];

// Routes
router.post('/', protect, createRoomValidation, createRoom);
router.get('/:identifier', protect, getRoom);
router.post('/:code/join', protect, joinRoom);
router.post('/:id/leave', protect, checkRoomMember, leaveRoom);
router.delete('/:id', protect, checkRoomHost, closeRoom);
router.put('/:id/settings', protect, checkRoomHost, updateRoomSettings);
router.get('/:id/queue', protect, checkRoomMember, getRoomQueue);
router.get('/:id/history', protect, checkRoomMember, getRoomHistory);

module.exports = router;
