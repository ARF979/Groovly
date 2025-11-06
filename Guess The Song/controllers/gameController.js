const GameRoom = require("../models/GameRoom");
const gameService = require("../services/gameService");
const spotifyService = require("../services/spotifyService");

/**
 * @desc    Create a new game room
 * @route   POST /api/game/rooms
 * @access  Private
 */
exports.createGameRoom = async (req, res, next) => {
  try {
    const {
      name,
      playlistId,
      roundCount = 10,
      clipDuration = 20,
      questionTime = 20,
    } = req.body;

    // Validate required fields
    if (!name || !playlistId) {
      return res.status(400).json({
        success: false,
        message: "Please provide room name and playlist ID",
      });
    }

    // Validate playlist ID
    if (!spotifyService.isValidPlaylistId(playlistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Spotify playlist ID format",
      });
    }

    // Verify playlist exists and has enough tracks
    try {
      const playlistDetails = await spotifyService.getPlaylistDetails(
        playlistId
      );
      if (playlistDetails.trackCount < roundCount) {
        return res.status(400).json({
          success: false,
          message: `Playlist has only ${playlistDetails.trackCount} tracks. Need at least ${roundCount}.`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          "Could not access playlist. Make sure it exists and is public.",
      });
    }

    // Generate unique room code
    const code = await GameRoom.generateRoomCode();

    // Create game room
    const gameRoom = await GameRoom.create({
      name,
      code,
      host: req.user._id,
      gameSettings: {
        roundCount,
        clipDuration,
        questionTime,
        playlistId,
      },
      totalRounds: roundCount,
      players: [
        {
          user: req.user._id,
          nickname: req.user.name,
          score: 0,
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: {
        roomId: gameRoom._id,
        roomCode: gameRoom.code,
        name: gameRoom.name,
        host: req.user.name,
        settings: gameRoom.gameSettings,
        status: gameRoom.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get game room by code
 * @route   GET /api/game/rooms/:code
 * @access  Private
 */
exports.getGameRoom = async (req, res, next) => {
  try {
    const { code } = req.params;

    const gameRoom = await GameRoom.findOne({
      code: code.toUpperCase(),
      isActive: true,
    }).populate("players.user", "name email");

    if (!gameRoom) {
      return res.status(404).json({
        success: false,
        message: "Game room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        roomId: gameRoom._id,
        roomCode: gameRoom.code,
        name: gameRoom.name,
        host: gameRoom.host,
        status: gameRoom.status,
        currentRound: gameRoom.currentRound,
        totalRounds: gameRoom.totalRounds,
        players: gameRoom.players.map((p) => ({
          userId: p.user._id,
          nickname: p.nickname,
          score: p.score,
        })),
        settings: gameRoom.gameSettings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Join a game room
 * @route   POST /api/game/rooms/:code/join
 * @access  Private
 */
exports.joinGameRoom = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: "Please provide a nickname",
      });
    }

    const gameRoom = await GameRoom.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!gameRoom) {
      return res.status(404).json({
        success: false,
        message: "Game room not found",
      });
    }

    if (gameRoom.status !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "Cannot join game in progress",
      });
    }

    // Check if player already in room
    const existingPlayer = gameRoom.players.find(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: "You are already in this game",
      });
    }

    // Check if nickname is taken
    const nicknameTaken = gameRoom.players.some((p) => p.nickname === nickname);
    if (nicknameTaken) {
      return res.status(400).json({
        success: false,
        message: "Nickname already taken",
      });
    }

    // Add player to game
    await gameRoom.addPlayer(req.user._id, nickname);

    res.status(200).json({
      success: true,
      message: "Joined game successfully",
      data: {
        roomId: gameRoom._id,
        roomCode: gameRoom.code,
        playerCount: gameRoom.playerCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start the game
 * @route   POST /api/game/rooms/:id/start
 * @access  Private (Host only)
 */
exports.startGame = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gameRoom = await GameRoom.findById(id);

    if (!gameRoom) {
      return res.status(404).json({
        success: false,
        message: "Game room not found",
      });
    }

    // Check if user is host
    if (!gameRoom.isHost(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the host can start the game",
      });
    }

    if (gameRoom.status !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "Game already started or finished",
      });
    }

    if (gameRoom.players.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Need at least 2 players to start",
      });
    }

    // Initialize game songs
    await gameService.initializeGameSongs(
      gameRoom._id,
      gameRoom.gameSettings.playlistId,
      gameRoom.totalRounds
    );

    // Update status
    gameRoom.status = "in-progress";
    await gameRoom.save();

    res.status(200).json({
      success: true,
      message: "Game started successfully",
      data: {
        roomId: gameRoom._id,
        status: gameRoom.status,
        totalRounds: gameRoom.totalRounds,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit an answer
 * @route   POST /api/game/rooms/:id/answer
 * @access  Private
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Please provide an answer",
      });
    }

    const result = await gameService.processAnswer(id, req.user._id, answer);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === "Player already answered this round") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/game/rooms/:id/leaderboard
 * @access  Private
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gameState = await gameService.getGameState(id);

    res.status(200).json({
      success: true,
      data: {
        leaderboard: gameState.leaderboard,
        currentRound: gameState.currentRound,
        totalRounds: gameState.totalRounds,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Leave game room
 * @route   POST /api/game/rooms/:id/leave
 * @access  Private
 */
exports.leaveGameRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gameRoom = await GameRoom.findById(id);

    if (!gameRoom) {
      return res.status(404).json({
        success: false,
        message: "Game room not found",
      });
    }

    await gameRoom.removePlayer(req.user._id);

    // If host leaves and game is waiting, delete room
    if (gameRoom.isHost(req.user._id) && gameRoom.status === "waiting") {
      gameRoom.isActive = false;
      await gameRoom.save();
    }

    res.status(200).json({
      success: true,
      message: "Left game room successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search Spotify playlists
 * @route   GET /api/game/playlists/search
 * @access  Private
 */
exports.searchPlaylists = async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    const playlists = await spotifyService.searchPlaylists(query, limit);

    res.status(200).json({
      success: true,
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};
