const mongoose = require('mongoose');
const { ROOM_MODES, DEFAULT_ROOM_SETTINGS, ROOM_CODE_LENGTH } = require('../config/constants');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [50, 'Room name cannot exceed 50 characters']
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: ROOM_CODE_LENGTH
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: Object.values(ROOM_MODES),
    default: ROOM_MODES.DEMOCRATIC
  },
  settings: {
    skipThreshold: {
      type: Number,
      default: DEFAULT_ROOM_SETTINGS.skipThreshold,
      min: 1,
      max: 100
    },
    maxQueueSize: {
      type: Number,
      default: DEFAULT_ROOM_SETTINGS.maxQueueSize,
      min: 1
    },
    maxSongsPerUser: {
      type: Number,
      default: DEFAULT_ROOM_SETTINGS.maxSongsPerUser,
      min: 1
    },
    allowDuplicates: {
      type: Boolean,
      default: DEFAULT_ROOM_SETTINGS.allowDuplicates
    },
    allowExplicit: {
      type: Boolean,
      default: DEFAULT_ROOM_SETTINGS.allowExplicit
    }
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['host', 'member'],
      default: 'member'
    }
  }],
  currentSong: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    default: null
  },
  playbackState: {
    isPlaying: {
      type: Boolean,
      default: false
    },
    position: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate unique room code
roomSchema.statics.generateRoomCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existingRoom = await this.findOne({ code, isActive: true });
    if (!existingRoom) {
      isUnique = true;
    }
  }

  return code;
};

// Method to add member
roomSchema.methods.addMember = function(userId) {
  const isMember = this.members.some(m => m.user.toString() === userId.toString());
  
  if (!isMember) {
    this.members.push({
      user: userId,
      role: this.host.toString() === userId.toString() ? 'host' : 'member'
    });
  }
  
  return this.save();
};

// Method to remove member
roomSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  return this.save();
};

// Method to check if user is host
roomSchema.methods.isHost = function(userId) {
  return this.host.toString() === userId.toString();
};

// Method to get member count
roomSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure virtuals are included in JSON
roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

// Index for efficient querying
roomSchema.index({ code: 1, isActive: 1 });
roomSchema.index({ host: 1 });

module.exports = mongoose.model('Room', roomSchema);
