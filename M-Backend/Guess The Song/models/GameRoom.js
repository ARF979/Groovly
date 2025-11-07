const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [50, "Room name cannot exceed 50 characters"],
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        nickname: {
          type: String,
          required: true,
          trim: true,
        },
        score: {
          type: Number,
          default: 0,
        },
        answeredCurrentRound: {
          type: Boolean,
          default: false,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    gameSettings: {
      roundCount: {
        type: Number,
        default: 10,
        min: 5,
        max: 50,
      },
      clipDuration: {
        type: Number,
        default: 20,
        min: 10,
        max: 30,
      },
      questionTime: {
        type: Number,
        default: 20,
        min: 10,
        max: 60,
      },
      playlistId: {
        type: String,
        required: true,
      },
    },
    currentRound: {
      type: Number,
      default: 0,
    },
    totalRounds: {
      type: Number,
      default: 10,
    },
    currentSong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSong",
      default: null,
    },
    roundStartTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["waiting", "in-progress", "finished"],
      default: "waiting",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique room code
gameRoomSchema.statics.generateRoomCode = async function () {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingRoom = await this.findOne({ code, isActive: true });
    if (!existingRoom) {
      isUnique = true;
    }
  }

  return code;
};

// Add player
gameRoomSchema.methods.addPlayer = function (userId, nickname) {
  const isPlayer = this.players.some(
    (p) => p.user.toString() === userId.toString()
  );

  if (!isPlayer) {
    this.players.push({
      user: userId,
      nickname,
      score: 0,
      answeredCurrentRound: false,
    });
  }

  return this.save();
};

// Remove player
gameRoomSchema.methods.removePlayer = function (userId) {
  this.players = this.players.filter(
    (p) => p.user.toString() !== userId.toString()
  );
  return this.save();
};

// Check if user is host
gameRoomSchema.methods.isHost = function (userId) {
  return this.host.toString() === userId.toString();
};

// Get leaderboard sorted by score
gameRoomSchema.methods.getLeaderboard = function () {
  return this.players
    .map((p) => ({
      userId: p.user,
      nickname: p.nickname,
      score: p.score,
    }))
    .sort((a, b) => b.score - a.score);
};

// Update player score
gameRoomSchema.methods.updatePlayerScore = function (userId, pointsToAdd) {
  const player = this.players.find(
    (p) => p.user.toString() === userId.toString()
  );
  if (player) {
    player.score += pointsToAdd;
    player.answeredCurrentRound = true;
  }
  return this.save();
};

// Reset answered status for new round
gameRoomSchema.methods.resetRoundAnswers = function () {
  this.players.forEach((p) => {
    p.answeredCurrentRound = false;
  });
  return this.save();
};

// Virtual for player count
gameRoomSchema.virtual("playerCount").get(function () {
  return this.players.length;
});

// Ensure virtuals are included in JSON
gameRoomSchema.set("toJSON", { virtuals: true });
gameRoomSchema.set("toObject", { virtuals: true });

// Indexes
gameRoomSchema.index({ code: 1, isActive: 1 });
gameRoomSchema.index({ host: 1 });

module.exports = mongoose.model("GameRoom", gameRoomSchema);
