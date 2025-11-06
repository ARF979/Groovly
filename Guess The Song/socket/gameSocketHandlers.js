const GameRoom = require("../models/GameRoom");
const gameService = require("../services/gameService");

/**
 * Setup Socket.io handlers for game namespace
 * @param {Object} io - Socket.io server instance
 */
const setupGameSocketHandlers = (io) => {
  // Create game namespace
  const gameNamespace = io.of("/game");

  gameNamespace.on("connection", (socket) => {
    console.log(`Game client connected: ${socket.id}`);

    /**
     * Join a game room
     */
    socket.on("game:join", async ({ roomCode, userId }) => {
      try {
        const gameRoom = await GameRoom.findOne({
          code: roomCode.toUpperCase(),
          isActive: true,
        });

        if (!gameRoom) {
          socket.emit("game:error", { message: "Game room not found" });
          return;
        }

        // Join socket room
        socket.join(roomCode.toUpperCase());
        socket.gameRoomCode = roomCode.toUpperCase();
        socket.userId = userId;

        // Notify all players in the room
        gameNamespace.to(roomCode.toUpperCase()).emit("game:player-joined", {
          playerCount: gameRoom.playerCount,
          players: gameRoom.players.map((p) => ({
            userId: p.user,
            nickname: p.nickname,
            score: p.score,
          })),
        });

        console.log(`User ${userId} joined game room ${roomCode}`);
      } catch (error) {
        console.error("Error joining game:", error);
        socket.emit("game:error", { message: "Failed to join game" });
      }
    });

    /**
     * Start a new round (host only)
     */
    socket.on("game:start-round", async ({ roomCode }) => {
      try {
        const gameRoom = await GameRoom.findOne({
          code: roomCode.toUpperCase(),
          isActive: true,
        });

        if (!gameRoom) {
          socket.emit("game:error", { message: "Game room not found" });
          return;
        }

        // Check if user is host
        if (!gameRoom.isHost(socket.userId)) {
          socket.emit("game:error", { message: "Only host can start rounds" });
          return;
        }

        // Start new round
        const roundData = await gameService.startNewRound(gameRoom._id);

        if (roundData.gameFinished) {
          // Game is finished
          const finalResults = await gameService.endGame(gameRoom._id);

          gameNamespace.to(roomCode.toUpperCase()).emit("game:finished", {
            leaderboard: finalResults.leaderboard,
            winners: finalResults.winners,
            stats: finalResults.stats,
          });
        } else {
          // Emit new round to all players
          gameNamespace.to(roomCode.toUpperCase()).emit("game:round-started", {
            roundNumber: roundData.roundNumber,
            totalRounds: roundData.totalRounds,
            song: roundData.song,
            questionTime: roundData.questionTime,
            startTime: Date.now(),
          });

          // Auto-end round after question time
          setTimeout(async () => {
            try {
              const updatedRoom = await GameRoom.findById(gameRoom._id);
              if (
                updatedRoom &&
                updatedRoom.currentRound === roundData.roundNumber
              ) {
                gameNamespace
                  .to(roomCode.toUpperCase())
                  .emit("game:round-ended", {
                    roundNumber: roundData.roundNumber,
                  });
              }
            } catch (error) {
              console.error("Error auto-ending round:", error);
            }
          }, roundData.questionTime * 1000);
        }
      } catch (error) {
        console.error("Error starting round:", error);
        socket.emit("game:error", { message: error.message });
      }
    });

    /**
     * Submit answer
     */
    socket.on("game:submit-answer", async ({ roomCode, answer }) => {
      try {
        const gameRoom = await GameRoom.findOne({
          code: roomCode.toUpperCase(),
          isActive: true,
        });

        if (!gameRoom) {
          socket.emit("game:error", { message: "Game room not found" });
          return;
        }

        // Process answer
        const result = await gameService.processAnswer(
          gameRoom._id,
          socket.userId,
          answer
        );

        // Send result to the player
        socket.emit("game:answer-result", {
          correct: result.correct,
          points: result.points,
          timeElapsed: result.timeElapsed,
          newScore: result.newScore,
          correctAnswer: result.correctAnswer,
        });

        // Get updated leaderboard
        const gameState = await gameService.getGameState(gameRoom._id);

        // Broadcast updated leaderboard to all players
        gameNamespace
          .to(roomCode.toUpperCase())
          .emit("game:leaderboard-updated", {
            leaderboard: gameState.leaderboard,
          });

        // Notify that a player answered
        gameNamespace.to(roomCode.toUpperCase()).emit("game:player-answered", {
          playerId: socket.userId,
          answeredCount: gameState.players.filter((p) => p.answeredCurrentRound)
            .length,
          totalPlayers: gameState.players.length,
        });
      } catch (error) {
        console.error("Error submitting answer:", error);
        socket.emit("game:error", { message: error.message });
      }
    });

    /**
     * Request current game state
     */
    socket.on("game:get-state", async ({ roomCode }) => {
      try {
        const gameRoom = await GameRoom.findOne({
          code: roomCode.toUpperCase(),
          isActive: true,
        });

        if (!gameRoom) {
          socket.emit("game:error", { message: "Game room not found" });
          return;
        }

        const gameState = await gameService.getGameState(gameRoom._id);

        socket.emit("game:state-update", {
          status: gameState.status,
          currentRound: gameState.currentRound,
          totalRounds: gameState.totalRounds,
          players: gameState.players,
          leaderboard: gameState.leaderboard,
        });
      } catch (error) {
        console.error("Error getting game state:", error);
        socket.emit("game:error", { message: "Failed to get game state" });
      }
    });

    /**
     * Leave game room
     */
    socket.on("game:leave", async ({ roomCode }) => {
      try {
        if (socket.gameRoomCode) {
          socket.leave(socket.gameRoomCode);

          const gameRoom = await GameRoom.findOne({
            code: roomCode.toUpperCase(),
            isActive: true,
          });

          if (gameRoom) {
            await gameRoom.removePlayer(socket.userId);

            // Notify others
            gameNamespace.to(roomCode.toUpperCase()).emit("game:player-left", {
              playerId: socket.userId,
              playerCount: gameRoom.playerCount,
            });

            // If host leaves during waiting, close room
            if (
              gameRoom.isHost(socket.userId) &&
              gameRoom.status === "waiting"
            ) {
              gameRoom.isActive = false;
              await gameRoom.save();

              gameNamespace
                .to(roomCode.toUpperCase())
                .emit("game:room-closed", {
                  message: "Host left the game",
                });
            }
          }
        }
      } catch (error) {
        console.error("Error leaving game:", error);
      }
    });

    /**
     * Handle disconnection
     */
    socket.on("disconnect", async () => {
      console.log(`Game client disconnected: ${socket.id}`);

      if (socket.gameRoomCode && socket.userId) {
        try {
          const gameRoom = await GameRoom.findOne({
            code: socket.gameRoomCode,
            isActive: true,
          });

          if (gameRoom) {
            // Notify others about disconnection
            gameNamespace
              .to(socket.gameRoomCode)
              .emit("game:player-disconnected", {
                playerId: socket.userId,
              });
          }
        } catch (error) {
          console.error("Error handling disconnect:", error);
        }
      }
    });
  });

  return gameNamespace;
};

module.exports = setupGameSocketHandlers;
