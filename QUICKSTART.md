# Quick Start Guide - DJ Party Mode Backend

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running OR MongoDB Atlas account
- ✅ npm or yarn installed

## Step-by-Step Setup

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already created with default values. Update if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dj-party-mode
JWT_SECRET=dj-party-mode-super-secret-jwt-key-change-in-production-123456789
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Or just run:
mongod
```

**Option B: MongoDB Atlas**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### 4. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     DJ PARTY MODE BACKEND - COLLABORIFY                   ║
║                                                            ║
║     Server running on port 5000                           ║
║     Environment: development                               ║
║     Socket.io: Enabled                                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

## Quick API Test

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### 4. Create a Room
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My First Room",
    "mode": "democratic"
  }'
```

## Using Postman

Import the `postman_collection.json` file into Postman:
1. Open Postman
2. Click Import
3. Select `postman_collection.json`
4. Start testing!

The collection includes:
- Authentication (Register, Login, Get Me)
- Room Management (Create, Join, Leave, Close)
- Song Operations (Add, Vote, Skip, Remove)
- Auto-saves tokens and IDs for easy testing

## Testing Socket.io

You can test Socket.io using a simple HTML client or tools like:
- Socket.IO Client Tool (browser extension)
- wscat
- Postman (has WebSocket support)

Example connection:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('join-room', { roomId: 'ROOM_ID_HERE' });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process using port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### JWT Secret Warning
Always change the JWT_SECRET in production!

## Next Steps

1. ✅ Server is running
2. ✅ Test API endpoints with Postman
3. ✅ Test Socket.io events
4. 🚀 Build your frontend
5. 🚀 Deploy to production

## Folder Structure Overview

```
src/
├── config/         # Configuration files
├── controllers/    # Business logic
├── middleware/     # Auth, validation, error handling
├── models/         # MongoDB schemas
├── routes/         # API routes
├── socket/         # Socket.io handlers
├── utils/          # Helper functions
└── __tests__/      # Unit tests
```

## Available NPM Scripts

- `npm start` - Run in production mode
- `npm run dev` - Run with nodemon (auto-reload)
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Support

For issues or questions:
1. Check the main README.md
2. Review the API documentation
3. Open an issue on GitHub

Happy coding! 🎵🎉
