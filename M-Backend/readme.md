# DJ Party Mode Backend - Collaborify

A real-time collaborative music experience backend built with Node.js, Express, Socket.io, and MongoDB.

## 🚀 Features

- **Real-time Collaboration**: Socket.io powered real-time updates for queue, voting, and playback
- **Room Management**: Create, join, and manage music rooms with unique codes
- **Democratic Voting**: Upvote/downvote songs to influence queue order
- **Multiple Room Modes**: Democratic, DJ Mode, and Auto-play
- **Host Controls**: Host can control playback (play, pause, skip, seek)
- **Smart Queue**: Automatic skip based on threshold, duplicate prevention
- **User Authentication**: JWT-based authentication with secure password hashing
- **RESTful API**: Comprehensive REST endpoints for all operations
- **Input Validation**: Request validation with detailed error messages
- **Error Handling**: Centralized error handling with appropriate status codes

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x (Local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd M-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/dj-party-mode
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Room Endpoints

#### Create Room
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Awesome Room",
  "mode": "democratic",
  "settings": {
    "skipThreshold": 50,
    "maxQueueSize": 100
  }
}
```

#### Get Room
```http
GET /api/rooms/:identifier
Authorization: Bearer <token>
```
*(identifier can be room ID or room code)*

#### Join Room
```http
POST /api/rooms/:code/join
Authorization: Bearer <token>
```

#### Leave Room
```http
POST /api/rooms/:id/leave
Authorization: Bearer <token>
```

#### Close Room (Host Only)
```http
DELETE /api/rooms/:id
Authorization: Bearer <token>
```

#### Get Room Queue
```http
GET /api/rooms/:id/queue
Authorization: Bearer <token>
```

#### Get Room History
```http
GET /api/rooms/:id/history
Authorization: Bearer <token>
```

### Song Endpoints

#### Add Song to Queue
```http
POST /api/rooms/:roomId/songs
Authorization: Bearer <token>
Content-Type: application/json

{
  "spotifyId": "3n3Ppam7vgaVa1iaRUc9Lp",
  "title": "Mr. Brightside",
  "artist": "The Killers",
  "album": "Hot Fuss",
  "durationMs": 222973,
  "albumArt": "https://...",
  "previewUrl": "https://..."
}
```

#### Upvote Song
```http
POST /api/rooms/:roomId/songs/:songId/upvote
Authorization: Bearer <token>
```

#### Downvote Song
```http
POST /api/rooms/:roomId/songs/:songId/downvote
Authorization: Bearer <token>
```

#### Skip Song
```http
POST /api/rooms/:roomId/songs/:songId/skip
Authorization: Bearer <token>
```

#### Remove Song
```http
DELETE /api/rooms/:roomId/songs/:songId
Authorization: Bearer <token>
```

## 🔌 Socket.io Events

### Client to Server

- `join-room`: Join a room's socket channel
- `leave-room`: Leave a room's socket channel
- `add-song`: Add a song to the queue
- `upvote`: Upvote a song
- `downvote`: Downvote a song
- `host-play`: Start playing a song (host only)
- `host-pause`: Pause current song (host only)
- `host-skip`: Skip current song (host only)
- `host-seek`: Seek to position (host only)

### Server to Client

- `queue-updated`: Queue has been modified
- `song-updated`: Song votes have changed
- `song-started`: A new song started playing
- `song-skipped`: A song was skipped
- `member-joined`: A member joined the room
- `member-left`: A member left the room
- `playback-state`: Playback state changed
- `error`: Error occurred
- `room-closed`: Room was closed by host

### Example Socket.io Usage (Client)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Join room
socket.emit('join-room', { roomId: 'room-id-here' });

// Listen for queue updates
socket.on('queue-updated', (data) => {
  console.log('Queue updated:', data);
});

// Upvote a song
socket.emit('upvote', { 
  roomId: 'room-id-here', 
  songId: 'song-id-here' 
});
```

## 🏗️ Project Structure

```
M-Backend/
├── src/
│   ├── config/
│   │   ├── constants.js       # App constants
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── roomController.js  # Room operations
│   │   └── songController.js  # Song operations
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   ├── roomAuth.js        # Room authorization
│   │   └── validate.js        # Input validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Room.js            # Room schema
│   │   └── Song.js            # Song schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── roomRoutes.js      # Room routes
│   │   ├── songRoutes.js      # Song routes
│   │   └── index.js           # Route aggregator
│   ├── socket/
│   │   ├── socketAuth.js      # Socket authentication
│   │   └── socketHandlers.js  # Socket event handlers
│   ├── __tests__/
│   │   ├── room.test.js       # Room tests
│   │   └── voting.test.js     # Voting logic tests
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Rate limiting ready (add express-rate-limit)

## 🎯 Room Modes

### Democratic Mode
- Songs are ordered by vote score (upvotes - downvotes)
- All members can influence the queue order
- Skip threshold applies

### DJ Mode
- Host has full control over queue order
- Members can add songs but cannot vote
- Host can skip any song instantly

### Auto-Play Mode
- Songs play in FIFO order
- Voting doesn't affect order
- Automatic progression through queue

## 📊 Database Models

### User
- name, email, password (hashed)
- spotifyId, avatarUrl
- activeRoom reference

### Room
- name, code (unique)
- host, mode, settings
- members array with roles
- currentSong, playbackState
- isActive flag

### Song
- spotifyId, title, artist, album
- durationMs, albumArt, previewUrl
- addedBy, room references
- upvotes, downvotes arrays
- status (queued, playing, played, skipped)
- Virtual voteScore field

## 🚀 Deployment

### Deploy to Heroku

1. Create a Heroku app
2. Add MongoDB Atlas add-on or configure external DB
3. Set environment variables
4. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway/Render

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/dj-party-mode |
| JWT_SECRET | JWT signing secret | required |
| JWT_EXPIRE | Token expiration | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |
| ROOM_CODE_LENGTH | Room code length | 6 |
| SKIP_THRESHOLD_PERCENTAGE | Default skip threshold | 50 |

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🐛 Known Issues

- None currently

## 📮 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Coding! 🎵🎉**
