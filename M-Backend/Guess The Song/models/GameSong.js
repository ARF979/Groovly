const mongoose = require("mongoose");

const gameSongSchema = new mongoose.Schema(
  {
    gameRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameRoom",
      required: true,
    },
    spotifyId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      trim: true,
    },
    previewUrl: {
      type: String,
      required: true,
    },
    albumArtUrl: {
      type: String,
    },
    duration: {
      type: Number, // in milliseconds
      default: 30000,
    },
    // Multiple choice options (includes correct answer + 3 wrong options)
    multipleChoiceOptions: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    roundNumber: {
      type: Number,
      required: true,
    },
    playedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
gameSongSchema.index({ gameRoom: 1, roundNumber: 1 });
gameSongSchema.index({ spotifyId: 1 });

// Method to shuffle multiple choice options
gameSongSchema.methods.shuffleOptions = function () {
  for (let i = this.multipleChoiceOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this.multipleChoiceOptions[i], this.multipleChoiceOptions[j]] = [
      this.multipleChoiceOptions[j],
      this.multipleChoiceOptions[i],
    ];
  }
  return this;
};

module.exports = mongoose.model("GameSong", gameSongSchema);
