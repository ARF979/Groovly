require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const createApp = require("./app");
const connectDB = require("./config/database");
const socketAuth = require("./socket/socketAuth");
const setupSocketHandlers = require("./socket/socketHandlers");
const setupGameSocketHandlers = require("../Guess The Song/socket/gameSocketHandlers");

// Connect to database
connectDB();

// Create Express app
const app = createApp();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket.io authentication middleware
io.use(socketAuth);

// Setup socket handlers for DJ/Party mode (default namespace)
setupSocketHandlers(io);

// Setup socket handlers for Game mode (/game namespace)
setupGameSocketHandlers(io);

// Make io accessible to routes if needed
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     DJ PARTY MODE BACKEND - COLLABORIFY                   ║
║                                                            ║
║     Server running on port ${PORT}                           ║
║     Environment: ${
    process.env.NODE_ENV || "development"
  }                            ║
║     Socket.io: Enabled                                     ║
║                                                            ║
║     API Docs: http://localhost:${PORT}/                      ║
║     Health: http://localhost:${PORT}/api/health              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = server;
