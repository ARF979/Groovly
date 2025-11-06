const express = require("express");
const router = express.Router();
const {
  createGameRoom,
  getGameRoom,
  joinGameRoom,
  startGame,
  submitAnswer,
  getLeaderboard,
  leaveGameRoom,
  searchPlaylists,
} = require("../controllers/gameController");

// Import auth middleware from main app
const { protect } = require("../../src/middleware/auth");

// Playlist search
router.get("/playlists/search", protect, searchPlaylists);

// Game room routes
router.post("/rooms", protect, createGameRoom);
router.get("/rooms/:code", protect, getGameRoom);
router.post("/rooms/:code/join", protect, joinGameRoom);
router.post("/rooms/:id/start", protect, startGame);
router.post("/rooms/:id/answer", protect, submitAnswer);
router.get("/rooms/:id/leaderboard", protect, getLeaderboard);
router.post("/rooms/:id/leave", protect, leaveGameRoom);

module.exports = router;
