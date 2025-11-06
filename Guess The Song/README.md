# 🎵 Guess the Song - Backend API

A real-time collaborative music guessing game built with Node.js, Express, Socket.io, and Spotify Web API.

## 🎮 What is Guess the Song?

An interactive multiplayer game where players compete to identify songs from Spotify. Perfect for parties, team building, or just having fun with friends!

**Key Features:**

- 🎯 Multiple game modes (Speed, Multiple Choice, Blind Test, Team Battle)
- ⚡ Real-time gameplay with Socket.io
- 🏆 Dynamic scoring and leaderboards
- 🎵 Spotify music integration
- 👥 Support for 2-50 players
- 📊 Detailed player statistics

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 14.x
MongoDB >= 4.x
Spotify Developer Account
```

### Installation

```bash
# Clone the repository
cd "M-Backend/Guess The Song"

# Install dependencies (use parent project's package.json)
cd ..
npm install

# Set up environment variables
cp .env.example .env
# Add your Spotify API credentials

# Start MongoDB
mongod

# Run the server
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All game endpoints require JWT authentication (except join by code).

```http
Authorization: Bearer <token>
```

Get token from `/api/auth/login` (teammate's DJ mode endpoint).

---

## 🎮 Game Room Endpoints

### Create Game Room

```http
POST /api/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Friday Night Music Quiz",
  "gameMode": "speed",
  "settings": {
    "roundCount": 10,
    "clipDuration": 20,
    "questionType": "both",
    "difficulty": "medium",
    "allowSkip": true,
    "hintEnabled": false
  },
  "playlist": {
    "type": "spotify-playlist",
    "sourceId": "37i9dQZF1DXcBWIGoYBM5M"
  }
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "gameRoom": {
      "_id": "507f1f77bcf86cd799439011",
      "roomCode": "ABC123",
      "name": "Friday Night Music Quiz",
      "host": {
        "_id": "user123",
        "name": "John Doe"
      },
      "gameMode": "speed",
      "settings": { ... },
      "gameState": "waiting",
      "players": [],
      "createdAt": "2024-11-06T10:00:00Z"
    }
  }
}
```

**Game Modes:**

- `speed` - First to buzz in wins
- `multiple-choice` - Choose from 4 options
- `blind-test` - Identify song, artist, and album
- `team-battle` - Team-based competition

**Playlist Types:**

- `spotify-playlist` - Use specific Spotify playlist
- `collaborative` - Players contribute songs
- `category` - Genre/decade-based selection

---

### Get Game Room

```http
GET /api/games/:code
```

**Example:**

```http
GET /api/games/ABC123
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "gameRoom": {
      "roomCode": "ABC123",
      "name": "Friday Night Music Quiz",
      "gameMode": "speed",
      "players": [
        {
          "userId": "user123",
          "nickname": "Player1",
          "score": 0,
          "isReady": false
        }
      ],
      "gameState": "waiting",
      "currentRound": null,
      "leaderboard": []
    }
  }
}
```

---

### Join Game Room

```http
POST /api/games/:code/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "MusicLover42",
  "avatar": "https://example.com/avatar.jpg",
  "team": "Team A"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "player": {
      "userId": "user456",
      "nickname": "MusicLover42",
      "avatar": "https://example.com/avatar.jpg",
      "team": "Team A",
      "score": 0
    },
    "gameRoom": { ... }
  }
}
```

**Errors:**

- `404` - Room not found
- `400` - Game already started
- `400` - Room is full
- `400` - Nickname already taken

---

### Start Game

```http
POST /api/games/:id/start
Authorization: Bearer <token>
```

**Requirements:**

- Must be room host
- At least 2 players
- All players ready (optional based on settings)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "gameRoom": {
      "_id": "507f1f77bcf86cd799439011",
      "gameState": "active",
      "currentRound": {
        "roundNumber": 1,
        "songId": "song123",
        "startTime": "2024-11-06T10:05:00Z"
      }
    }
  }
}
```

---

### Submit Answer

```http
POST /api/games/:id/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "guess": {
    "song": "Bohemian Rhapsody",
    "artist": "Queen"
  },
  "timestamp": 1699268712345
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "result": {
      "isCorrect": true,
      "points": 125,
      "rank": 1,
      "timeElapsed": 5.2,
      "correctAnswer": {
        "song": "Bohemian Rhapsody",
        "artist": "Queen",
        "album": "A Night at the Opera"
      },
      "breakdown": {
        "basePoints": 150,
        "speedMultiplier": 1.5,
        "streakBonus": 25
      }
    },
    "player": {
      "score": 125,
      "stats": {
        "correctGuesses": 1,
        "currentStreak": 1
      }
    }
  }
}
```

**Response (Wrong Answer):**

```json
{
  "success": true,
  "data": {
    "result": {
      "isCorrect": false,
      "points": -20,
      "rank": null,
      "timeElapsed": 12.4,
      "correctAnswer": null
    },
    "player": {
      "score": -20
    }
  }
}
```

---

### Get Leaderboard

```http
GET /api/games/:id/leaderboard
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user123",
        "nickname": "Player1",
        "avatar": "https://...",
        "score": 450,
        "stats": {
          "correctGuesses": 8,
          "wrongGuesses": 2,
          "averageTime": 6.3,
          "bestStreak": 5
        }
      },
      {
        "rank": 2,
        "userId": "user456",
        "nickname": "MusicLover42",
        "score": 380,
        "stats": { ... }
      }
    ],
    "totalRounds": 10,
    "completedRounds": 10
  }
}
```

---

### Next Round (Host Only)

```http
POST /api/games/:id/round/next
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "round": {
      "roundNumber": 2,
      "songId": "song456",
      "startTime": "2024-11-06T10:10:00Z"
    }
  }
}
```

---

### Game Statistics

```http
GET /api/games/:id/stats
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalPlayers": 8,
      "totalRounds": 10,
      "averageScore": 325,
      "fastestAnswer": 2.1,
      "mostGuessedSong": "Bohemian Rhapsody",
      "highestScore": 450,
      "perfectRounds": 3,
      "distribution": {
        "correct": 65,
        "wrong": 15,
        "timeout": 0
      }
    }
  }
}
```

---

### End Game (Host Only)

```http
POST /api/games/:id/end
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "finalResults": {
      "winner": {
        "userId": "user123",
        "nickname": "Player1",
        "score": 450
      },
      "leaderboard": [ ... ],
      "stats": { ... },
      "gameId": "507f1f77bcf86cd799439011",
      "duration": 1200000
    }
  }
}
```

---

## 🔌 Socket.io Events

### Connection

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000/game", {
  auth: {
    token: "your-jwt-token",
  },
});

// Join game room
socket.emit("game:join", { roomCode: "ABC123" });
```

---

### Client → Server Events

#### Join Game Room

```javascript
socket.emit("game:join", {
  roomCode: "ABC123",
});
```

#### Submit Guess

```javascript
socket.emit("guess:submit", {
  roomId: "room123",
  guess: {
    song: "Bohemian Rhapsody",
    artist: "Queen",
  },
  timestamp: Date.now(),
});
```

#### Skip Song

```javascript
socket.emit("guess:skip", {
  roomId: "room123",
});
```

#### Player Ready

```javascript
socket.emit("player:ready", {
  roomId: "room123",
  isReady: true,
});
```

#### Request Hint

```javascript
socket.emit("hint:request", {
  roomId: "room123",
});
```

---

### Server → Client Events

#### Round Started

```javascript
socket.on("round:start", (data) => {
  console.log("Round", data.roundNumber);
  console.log("Song preview:", data.songPreviewUrl);
  console.log("Clip duration:", data.clipDuration);

  // For multiple choice mode
  if (data.options) {
    console.log("Options:", data.options);
  }

  // Start playing audio
  playAudio(data.songPreviewUrl);
});
```

**Data Structure:**

```json
{
  "roundNumber": 3,
  "songPreviewUrl": "https://p.scdn.co/mp3-preview/...",
  "albumArt": "https://i.scdn.co/image/...",
  "clipDuration": 20,
  "options": ["Song A", "Song B", "Song C", "Song D"]
}
```

#### Guess Received

```javascript
socket.on("guess:received", (data) => {
  console.log(`You were #${data.rank} to answer`);
});
```

**Data:**

```json
{
  "userId": "user123",
  "rank": 2,
  "timestamp": 1699268712345
}
```

#### Round Ended

```javascript
socket.on("round:end", (data) => {
  console.log("Correct answer:", data.correctAnswer);
  console.log("Your result:", data.yourResult);
  console.log("Updated leaderboard:", data.leaderboard);
});
```

**Data:**

```json
{
  "roundNumber": 3,
  "correctAnswer": {
    "song": "Bohemian Rhapsody",
    "artist": "Queen",
    "album": "A Night at the Opera"
  },
  "playerAnswers": [
    {
      "userId": "user123",
      "nickname": "Player1",
      "guess": { ... },
      "isCorrect": true,
      "points": 125,
      "rank": 1
    }
  ],
  "leaderboard": [ ... ]
}
```

#### Leaderboard Update

```javascript
socket.on("leaderboard:update", (data) => {
  updateUI(data.leaderboard);
});
```

#### Player Joined

```javascript
socket.on("player:joined", (data) => {
  console.log(`${data.player.nickname} joined!`);
});
```

#### Player Left

```javascript
socket.on("player:left", (data) => {
  console.log(`${data.nickname} left`);
});
```

#### Game Ended

```javascript
socket.on("game:end", (data) => {
  console.log("Winner:", data.winner);
  console.log("Final scores:", data.finalScores);
  console.log("Statistics:", data.stats);
});
```

#### Hint Received

```javascript
socket.on("hint:received", (data) => {
  console.log("Hint:", data.hint);
  // data.hint might be: "Song starts with 'B'"
});
```

#### Error

```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error.message);
});
```

---

## 🗄️ Database Models

### GameRoom Model

```javascript
{
  roomCode: String,              // 6-digit unique code
  name: String,                  // "Friday Night Quiz"
  hostId: ObjectId,              // Reference to User
  gameMode: String,              // 'speed', 'multiple-choice', etc.
  settings: {
    roundCount: Number,          // 5-50
    clipDuration: Number,        // 10-30 seconds
    questionType: String,        // 'song', 'artist', 'both'
    difficulty: String,          // 'easy', 'medium', 'hard'
    allowSkip: Boolean,
    hintEnabled: Boolean,
    hintCost: Number             // Points deducted for hint
  },
  playlist: {
    type: String,                // 'spotify-playlist', 'collaborative', 'category'
    sourceId: String,            // Playlist ID or category name
    songPool: [ObjectId]         // References to GameSong
  },
  players: [{
    userId: ObjectId,
    nickname: String,
    avatar: String,
    team: String,
    score: Number,
    isReady: Boolean,
    stats: {
      correctGuesses: Number,
      wrongGuesses: Number,
      timeouts: Number,
      averageTime: Number,
      currentStreak: Number,
      bestStreak: Number,
      hintsUsed: Number
    }
  }],
  gameState: String,             // 'waiting', 'active', 'paused', 'finished'
  currentRound: {
    roundNumber: Number,
    songId: ObjectId,
    startTime: Date,
    endTime: Date,
    answers: [{
      userId: ObjectId,
      guess: {
        song: String,
        artist: String,
        album: String
      },
      timestamp: Date,
      timeElapsed: Number,
      isCorrect: Boolean,
      pointsAwarded: Number
    }]
  },
  leaderboard: [{
    userId: ObjectId,
    rank: Number,
    score: Number,
    wins: Number
  }],
  history: [CurrentRoundSchema],  // All past rounds
  createdAt: Date,
  updatedAt: Date
}
```

### GameSong Model

```javascript
{
  spotifyId: String,             // Spotify track ID
  title: String,
  artist: String,
  album: String,
  previewUrl: String,            // 30-second preview
  albumArt: String,
  durationMs: Number,
  releaseYear: Number,
  popularity: Number,            // 0-100
  genres: [String],
  difficulty: Number,            // Calculated based on popularity
  timesPlayed: Number,
  timesGuessedCorrect: Number,
  averageGuessTime: Number
}
```

---

## 🎯 Scoring Algorithm

### Base Points

```javascript
const SCORING = {
  // Correct answer points
  PERFECT_GUESS: 150, // Song + Artist correct
  SONG_ONLY: 75, // Only song title
  ARTIST_ONLY: 50, // Only artist name

  // Multipliers
  SPEED_MULTIPLIER: 2.0, // Answered in < 3 seconds
  COMBO_BONUS: 25, // 3+ correct in a row
  STREAK_5: 1.5, // 5+ streak multiplier
  STREAK_10: 2.0, // 10+ streak multiplier

  // Penalties
  WRONG_ANSWER: -20, // Incorrect guess
  TIMEOUT: 0, // No answer
  HINT_COST: -10, // Per hint requested
};
```

### Time-Based Calculation

```javascript
function calculateScore(answer, correctAnswer, timeElapsed, streak) {
  let basePoints = 0;

  // Determine base points
  const songCorrect =
    answer.song.toLowerCase() === correctAnswer.song.toLowerCase();
  const artistCorrect =
    answer.artist.toLowerCase() === correctAnswer.artist.toLowerCase();

  if (songCorrect && artistCorrect) {
    basePoints = SCORING.PERFECT_GUESS;
  } else if (songCorrect) {
    basePoints = SCORING.SONG_ONLY;
  } else if (artistCorrect) {
    basePoints = SCORING.ARTIST_ONLY;
  } else {
    return SCORING.WRONG_ANSWER;
  }

  // Time multiplier (points decrease over time)
  const timeMultiplier = Math.max(0.5, 1 - (timeElapsed / 30) * 0.5);
  let finalPoints = basePoints * timeMultiplier;

  // Speed bonus
  if (timeElapsed < 3) {
    finalPoints *= SCORING.SPEED_MULTIPLIER;
  }

  // Streak bonuses
  if (streak >= 10) {
    finalPoints *= SCORING.STREAK_10;
  } else if (streak >= 5) {
    finalPoints *= SCORING.STREAK_5;
  } else if (streak >= 3) {
    finalPoints += SCORING.COMBO_BONUS;
  }

  return Math.round(finalPoints);
}
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/guess-the-song

# Authentication (from teammate's DJ mode)
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Spotify API
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback

# CORS
CLIENT_URL=http://localhost:3000

# Game Settings
DEFAULT_ROUND_COUNT=10
DEFAULT_CLIP_DURATION=20
MAX_PLAYERS=50
ROOM_CODE_LENGTH=6
```

### Game Constants

Located in `src/config/constants.js`:

```javascript
module.exports = {
  GAME_MODES: {
    SPEED: 'speed',
    MULTIPLE_CHOICE: 'multiple-choice',
    BLIND_TEST: 'blind-test',
    TEAM_BATTLE: 'team-battle'
  },

  DIFFICULTY_LEVELS: {
    EASY: 'easy',     // Popular songs (70-100 popularity)
    MEDIUM: 'medium', // Moderate (40-70 popularity)
    HARD: 'hard'      // Obscure (0-40 popularity)
  },

  CLIP_DURATION: {
    MIN: 10,
    MAX: 30,
    DEFAULT: 20
  },

  ROUND_COUNT: {
    MIN: 5,
    MAX: 50,
    DEFAULT: 10
  },

  SCORING: { ... }
};
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run game-specific tests
npm test -- game/

# Run with coverage
npm test -- --coverage game/

# Watch mode
npm run test:watch
```

### Test Files

```
__tests__/
└── game/
    ├── gameRoom.test.js
    ├── scoring.test.js
    ├── answerValidation.test.js
    ├── leaderboard.test.js
    └── socketEvents.test.js
```

### Example Test

```javascript
// __tests__/game/scoring.test.js
const { calculateScore } = require("../../src/services/scoringService");

describe("Scoring Algorithm", () => {
  test("should award full points for perfect guess under 3 seconds", () => {
    const answer = { song: "Bohemian Rhapsody", artist: "Queen" };
    const correct = { song: "Bohemian Rhapsody", artist: "Queen" };
    const timeElapsed = 2.5;
    const streak = 0;

    const points = calculateScore(answer, correct, timeElapsed, streak);
    expect(points).toBe(300); // 150 * 2.0 speed multiplier
  });

  test("should penalize wrong answer", () => {
    const answer = { song: "Wrong Song", artist: "Wrong Artist" };
    const correct = { song: "Bohemian Rhapsody", artist: "Queen" };

    const points = calculateScore(answer, correct, 5, 0);
    expect(points).toBe(-20);
  });
});
```

---

## 🚀 Deployment

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create guess-the-song-api

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set SPOTIFY_CLIENT_ID=your-id
heroku config:set SPOTIFY_CLIENT_SECRET=your-secret

# Deploy
git push heroku main

# Open app
heroku open
```

### Railway

1. Connect GitHub repository
2. Add environment variables in dashboard
3. Deploys automatically on push to main

---

## 📊 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Room not found",
    "statusCode": 404,
    "field": "roomCode"
  }
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (not host)
- `404` - Not Found (room doesn't exist)
- `409` - Conflict (nickname taken)
- `500` - Server Error

---

## 🔒 Security

### Rate Limiting

```javascript
// 10 answer submissions per minute per user
const answerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many guesses, please slow down",
});

router.post("/games/:id/answer", answerLimiter, submitAnswer);
```

### Input Validation

```javascript
// Answer validation
{
  guess: {
    song: Joi.string().trim().max(200),
    artist: Joi.string().trim().max(200)
  },
  timestamp: Joi.number().required()
}
```

### Anti-Cheat

- Server-side timestamp verification
- Answer submitted before round started → rejected
- Multiple rapid submissions → rate limited
- Identical answers from different IPs → flagged

---

## 🐛 Known Issues & Limitations

1. **Preview URLs** - Not all Spotify tracks have 30-second previews
2. **Song Matching** - Fuzzy matching may allow slight misspellings
3. **Network Latency** - Timing accuracy depends on connection
4. **Spotify Rate Limits** - API calls are throttled (30 req/sec)

---

## 🤝 Contributing

### Code Style

```bash
# Format code
npm run format

# Lint
npm run lint
```

### Commit Convention

```
feat: Add team battle mode
fix: Correct scoring calculation
docs: Update API documentation
test: Add leaderboard tests
refactor: Optimize song fetching
```

---

## 📝 License

MIT

---

## 🆘 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check DESIGN.md for architecture details
- **Team Guide**: See TEAM_GUIDE.md for collaboration workflow

---

## 🎉 Credits

Built with:

- Express.js
- Socket.io
- MongoDB
- Spotify Web API
- JWT Authentication

Inspired by: SongTrivia, SpotiGuess, and classic music quiz games.
