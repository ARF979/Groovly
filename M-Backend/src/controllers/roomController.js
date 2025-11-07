const Room = require('../models/Room');
const Song = require('../models/Song');
const User = require('../models/User');
const { SONG_STATUS } = require('../config/constants');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
exports.createRoom = async (req, res, next) => {
  try {
    const { name, mode, settings } = req.body;

    // Check if user already has an active room
    const existingRoom = await Room.findOne({ 
      host: req.user._id, 
      isActive: true 
    });

    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active room. Close it before creating a new one.'
      });
    }

    // Generate unique room code
    const code = await Room.generateRoomCode();

    // Create room
    const room = await Room.create({
      name,
      code,
      host: req.user._id,
      mode: mode || 'democratic',
      settings: settings || {},
      members: [{
        user: req.user._id,
        role: 'host'
      }]
    });

    // Update user's active room
    await User.findByIdAndUpdate(req.user._id, { activeRoom: room._id });

    const populatedRoom = await Room.findById(room._id)
      .populate('host', 'name email avatarUrl')
      .populate('members.user', 'name email avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: populatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room by ID or code
// @route   GET /api/rooms/:identifier
// @access  Private
exports.getRoom = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is ObjectId or room code
    let room;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      room = await Room.findById(identifier);
    } else {
      // It's a room code
      room = await Room.findOne({ code: identifier.toUpperCase(), isActive: true });
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Populate room details
    room = await Room.findById(room._id)
      .populate('host', 'name email avatarUrl')
      .populate('members.user', 'name email avatarUrl')
      .populate('currentSong');

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a room
// @route   POST /api/rooms/:code/join
// @access  Private
exports.joinRoom = async (req, res, next) => {
  try {
    const { code } = req.params;

    const room = await Room.findOne({ code: code.toUpperCase(), isActive: true });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or inactive'
      });
    }

    // Check if user is already a member
    const isMember = room.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this room'
      });
    }

    // Add user to room
    await room.addMember(req.user._id);

    // Update user's active room
    await User.findByIdAndUpdate(req.user._id, { activeRoom: room._id });

    const populatedRoom = await Room.findById(room._id)
      .populate('host', 'name email avatarUrl')
      .populate('members.user', 'name email avatarUrl')
      .populate('currentSong');

    res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: populatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a room
// @route   POST /api/rooms/:id/leave
// @access  Private
exports.leaveRoom = async (req, res, next) => {
  try {
    const room = req.room;

    // Check if user is the host
    if (room.isHost(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Host cannot leave the room. Please close the room instead.'
      });
    }

    // Remove user from room
    await room.removeMember(req.user._id);

    // Update user's active room
    await User.findByIdAndUpdate(req.user._id, { activeRoom: null });

    // Emit socket event to notify other members
    const io = req.app.get('io');
    if (io) {
      io.to(room._id.toString()).emit('member-left', {
        user: req.user
      });
    }

    res.status(200).json({
      success: true,
      message: 'Left room successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close a room (host only)
// @route   DELETE /api/rooms/:id
// @access  Private (Host only)
exports.closeRoom = async (req, res, next) => {
  try {
    const room = req.room;

    // Emit socket event to notify all members before closing
    const io = req.app.get('io');
    if (io) {
      io.to(room._id.toString()).emit('room-closed');
    }

    // Mark room as inactive
    room.isActive = false;
    await room.save();

    // Clear active room for all members
    await User.updateMany(
      { _id: { $in: room.members.map(m => m.user) } },
      { activeRoom: null }
    );

    res.status(200).json({
      success: true,
      message: 'Room closed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room settings (host only)
// @route   PUT /api/rooms/:id/settings
// @access  Private (Host only)
exports.updateRoomSettings = async (req, res, next) => {
  try {
    const room = req.room;
    const { settings } = req.body;

    room.settings = { ...room.settings, ...settings };
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room settings updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room queue
// @route   GET /api/rooms/:id/queue
// @access  Private (Members only)
exports.getRoomQueue = async (req, res, next) => {
  try {
    const songs = await Song.find({
      room: req.params.id,
      status: SONG_STATUS.QUEUED
    })
      .populate('addedBy', 'name avatarUrl')
      .sort({ createdAt: 1 });

    // Sort by vote score for democratic mode
    const room = req.room;
    if (room.mode === 'democratic') {
      songs.sort((a, b) => b.voteScore - a.voteScore || a.createdAt - b.createdAt);
    }

    res.status(200).json({
      success: true,
      data: songs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room history
// @route   GET /api/rooms/:id/history
// @access  Private (Members only)
exports.getRoomHistory = async (req, res, next) => {
  try {
    const songs = await Song.find({
      room: req.params.id,
      status: { $in: [SONG_STATUS.PLAYED, SONG_STATUS.SKIPPED] }
    })
      .populate('addedBy', 'name avatarUrl')
      .sort({ playedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: songs
    });
  } catch (error) {
    next(error);
  }
};
