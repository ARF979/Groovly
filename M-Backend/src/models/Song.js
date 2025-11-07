const mongoose = require('mongoose');
const { SONG_STATUS } = require('../config/constants');

const songSchema = new mongoose.Schema({
  youtubeId: {
    type: String,
    required: [true, 'YouTube ID is required']
  },
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  durationMs: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0, 'Duration must be positive']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: Object.values(SONG_STATUS),
    default: SONG_STATUS.QUEUED
  },
  playedAt: {
    type: Date,
    default: null
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for vote score
songSchema.virtual('voteScore').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Ensure virtuals are included in JSON
songSchema.set('toJSON', { virtuals: true });
songSchema.set('toObject', { virtuals: true });

// Index for efficient querying
songSchema.index({ room: 1, status: 1, createdAt: 1 });
songSchema.index({ youtubeId: 1, room: 1 });

module.exports = mongoose.model('Song', songSchema);
