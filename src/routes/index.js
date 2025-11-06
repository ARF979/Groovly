const authRoutes = require("./authRoutes");
const roomRoutes = require("./roomRoutes");
const songRoutes = require("./songRoutes");
const gameRoutes = require("../../Guess The Song/routes/gameRoutes");

module.exports = (app) => {
  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/rooms/:roomId/songs", songRoutes);
  app.use("/api/game", gameRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Root route
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "DJ Party Mode & Guess The Song API",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        rooms: "/api/rooms",
        game: "/api/game",
        health: "/api/health",
      },
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });
};
