const GameRoom = require("../models/GameRoom");
const GameSong = require("../models/GameSong");
const spotifyService = require("./spotifyService");
const scoringService = require("./scoringService");

class GameService {
  /**
   * Initialize game songs for a room
   * @param {string} gameRoomId - Game room ID
   * @param {string} playlistId - Spotify playlist ID
   * @param {number} roundCount - Number of rounds
   * @returns {Array} Array of created game songs
   */
  async initializeGameSongs(gameRoomId, playlistId, roundCount = 10) {
    try {
      // Fetch tracks from Spotify
      const tracks = await spotifyService.getPlaylistTracks(
        playlistId,
        roundCount
      );

      // Create game songs with multiple choice options
      const gameSongs = [];

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];

        // Get wrong answer options
        const wrongAnswers = await spotifyService.getWrongAnswerOptions(
          track.title,
          playlistId
        );

        // Create multiple choice options (1 correct + 3 wrong)
        const options = [
          { text: track.title, isCorrect: true },
          { text: wrongAnswers[0], isCorrect: false },
          { text: wrongAnswers[1], isCorrect: false },
          { text: wrongAnswers[2], isCorrect: false },
        ];

        // Shuffle options
        this.shuffleArray(options);

        const gameSong = await GameSong.create({
          gameRoom: gameRoomId,
          spotifyId: track.spotifyId,
          title: track.title,
          artist: track.artist,
          album: track.album,
          previewUrl: track.previewUrl,
          albumArtUrl: track.albumArtUrl,
          duration: 20000, // 20 seconds
          multipleChoiceOptions: options,
          correctAnswer: track.title,
          roundNumber: i + 1,
        });

        gameSongs.push(gameSong);
      }

      return gameSongs;
    } catch (error) {
      console.error("Error initializing game songs:", error);
      throw error;
    }
  }

  /**
   * Start a new round
   * @param {string} gameRoomId - Game room ID
   * @returns {Object} Round data
   */
  async startNewRound(gameRoomId) {
    try {
      const gameRoom = await GameRoom.findById(gameRoomId);

      if (!gameRoom) {
        throw new Error("Game room not found");
      }

      if (gameRoom.status !== "in-progress") {
        throw new Error("Game is not in progress");
      }

      // Move to next round
      const nextRound = gameRoom.currentRound + 1;

      if (nextRound > gameRoom.totalRounds) {
        // Game finished
        gameRoom.status = "finished";
        await gameRoom.save();
        return { gameFinished: true };
      }

      // Get the song for this round
      const currentSong = await GameSong.findOne({
        gameRoom: gameRoomId,
        roundNumber: nextRound,
      });

      if (!currentSong) {
        throw new Error("Song not found for this round");
      }

      // Update game room
      gameRoom.currentRound = nextRound;
      gameRoom.currentSong = currentSong._id;
      gameRoom.roundStartTime = new Date();
      await gameRoom.resetRoundAnswers();
      await gameRoom.save();

      // Mark song as played
      currentSong.playedAt = new Date();
      await currentSong.save();

      return {
        gameFinished: false,
        roundNumber: nextRound,
        totalRounds: gameRoom.totalRounds,
        song: {
          previewUrl: currentSong.previewUrl,
          albumArtUrl: currentSong.albumArtUrl,
          artist: currentSong.artist,
          multipleChoiceOptions: currentSong.multipleChoiceOptions.map(
            (opt) => ({
              text: opt.text,
            })
          ), // Don't send isCorrect to clients
          duration: currentSong.duration,
        },
        questionTime: gameRoom.gameSettings.questionTime,
      };
    } catch (error) {
      console.error("Error starting new round:", error);
      throw error;
    }
  }

  /**
   * Process player answer
   * @param {string} gameRoomId - Game room ID
   * @param {string} userId - User ID
   * @param {string} answer - Selected answer
   * @returns {Object} Answer result
   */
  async processAnswer(gameRoomId, userId, answer) {
    try {
      const gameRoom = await GameRoom.findById(gameRoomId);

      if (!gameRoom) {
        throw new Error("Game room not found");
      }

      if (gameRoom.status !== "in-progress") {
        throw new Error("Game is not in progress");
      }

      // Check if player already answered
      const player = gameRoom.players.find(
        (p) => p.user.toString() === userId.toString()
      );

      if (!player) {
        throw new Error("Player not found in game");
      }

      if (player.answeredCurrentRound) {
        throw new Error("Player already answered this round");
      }

      // Get current song
      const currentSong = await GameSong.findById(gameRoom.currentSong);

      if (!currentSong) {
        throw new Error("Current song not found");
      }

      // Validate timing
      const timingResult = scoringService.validateAnswerTiming(
        gameRoom.roundStartTime,
        gameRoom.gameSettings.questionTime
      );

      if (!timingResult.isValid) {
        return {
          correct: false,
          points: 0,
          timeElapsed: timingResult.timeElapsed,
          message: "Time expired",
        };
      }

      // Check if answer is correct
      const isCorrect = answer === currentSong.correctAnswer;

      // Calculate points
      const points = scoringService.calculateMultipleChoicePoints(
        isCorrect,
        timingResult.timeElapsed
      );

      // Update player score
      await gameRoom.updatePlayerScore(userId, points);

      return {
        correct: isCorrect,
        points,
        timeElapsed: timingResult.timeElapsed,
        correctAnswer: currentSong.correctAnswer,
        newScore: player.score + points,
      };
    } catch (error) {
      console.error("Error processing answer:", error);
      throw error;
    }
  }

  /**
   * Get current game state
   * @param {string} gameRoomId - Game room ID
   * @returns {Object} Game state
   */
  async getGameState(gameRoomId) {
    try {
      const gameRoom = await GameRoom.findById(gameRoomId)
        .populate("players.user", "name email")
        .populate("currentSong");

      if (!gameRoom) {
        throw new Error("Game room not found");
      }

      return {
        roomCode: gameRoom.code,
        status: gameRoom.status,
        currentRound: gameRoom.currentRound,
        totalRounds: gameRoom.totalRounds,
        players: gameRoom.players.map((p) => ({
          userId: p.user._id,
          nickname: p.nickname,
          score: p.score,
          answeredCurrentRound: p.answeredCurrentRound,
        })),
        leaderboard: scoringService.generateLeaderboard(gameRoom.players),
      };
    } catch (error) {
      console.error("Error getting game state:", error);
      throw error;
    }
  }

  /**
   * End game and get final results
   * @param {string} gameRoomId - Game room ID
   * @returns {Object} Final game results
   */
  async endGame(gameRoomId) {
    try {
      const gameRoom = await GameRoom.findById(gameRoomId);

      if (!gameRoom) {
        throw new Error("Game room not found");
      }

      gameRoom.status = "finished";
      await gameRoom.save();

      const leaderboard = scoringService.generateLeaderboard(gameRoom.players);
      const stats = scoringService.calculateGameStats(gameRoom.players);
      const winners = scoringService.determineWinners(gameRoom.players);

      return {
        leaderboard,
        stats,
        winners: winners.map((w) => ({
          userId: w.user,
          nickname: w.nickname,
          score: w.score,
        })),
        totalRounds: gameRoom.totalRounds,
      };
    } catch (error) {
      console.error("Error ending game:", error);
      throw error;
    }
  }

  /**
   * Shuffle array helper
   * @param {Array} array - Array to shuffle
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

module.exports = new GameService();
