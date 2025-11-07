const authRoutes = require("./authRoutes");
const roomRoutes = require("./roomRoutes");
const songRoutes = require("./songRoutes");
const youtubeRoutes = require("./youtubeRoutes");

module.exports = (app) => {
  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/rooms/:roomId/songs", songRoutes);
  app.use("/api/youtube", youtubeRoutes);

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
      message: "Groovly API - Collaborative Music Platform",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        rooms: "/api/rooms",
        youtube: "/api/youtube",
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
