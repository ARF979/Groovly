const Room = require('../models/Room');

// Check if user is a member of the room
const checkRoomMember = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId || req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const isMember = room.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this room'
      });
    }

    req.room = room;
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is the host of the room
const checkRoomHost = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId || req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can perform this action'
      });
    }

    req.room = room;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkRoomMember, checkRoomHost };
