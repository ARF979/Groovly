# 🚀 Groovly - Quick Start Guide

This guide will help you get both the backend and frontend running in minutes.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - Check: `node --version`
- ✅ npm or yarn - Check: `npm --version`
- ✅ MongoDB installed and running - Check: `mongod --version`

## Step-by-Step Setup

### 1️⃣ Start MongoDB

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Or manually:**
```bash
mongod --dbpath /path/to/your/data/directory
```

**Verify it's running:**
```bash
# Should connect to MongoDB
mongosh
```

---

### 2️⃣ Setup & Start Backend

```bash
# Navigate to backend
cd M-Backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/groovly
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
ROOM_CODE_LENGTH=6
SKIP_THRESHOLD_PERCENTAGE=50
EOF

# Start the backend server
npm run dev
```

**✅ Backend should now be running on http://localhost:5000**

You should see:
```
Server running on port 5000
MongoDB Connected
```

---

### 3️⃣ Setup & Start Frontend

**Open a new terminal window/tab:**

```bash
# Navigate to frontend
cd M-Frontend/groovly-landing

# Install dependencies (if not already done)
npm install

# Environment is already configured in .env.local
# If not, create it:
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF

# Start the development server
npm run dev
```

**✅ Frontend should now be running on http://localhost:3000**

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## 4️⃣ Test the Application

### Create Your First Account

1. **Open browser** → http://localhost:3000
2. **Click "Sign Up"** (top right)
3. **Fill in details:**
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. **Click "Sign Up"**
5. **You'll be redirected to the dashboard** ✨

### Create Your First Room

1. **On Dashboard**, click **"Create Room"**
2. **Enter room details:**
   - Room Name: "My First Party"
   - Mode: Democratic (recommended)
3. **Click "Create Room"**
4. **You're now in your room!** 🎉

### Add Your First Song

1. **Click "Add Song"** button
2. **Fill in song details:**
   - Title: "Mr. Brightside"
   - Artist: "The Killers"
   - Album: "Hot Fuss" (optional)
3. **Click "Add to Queue"**
4. **Song appears in queue!** 🎵

### Test Real-time Features

1. **Open a second browser window** (or incognito)
2. **Create another account** (different email)
3. **Click "Join Room"** on dashboard
4. **Enter the room code** (shown at top of room page)
5. **You're now in the same room!**
6. **Try voting on songs** - both windows update in real-time! ⚡

---

## 🎯 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can create account
- [ ] Can login
- [ ] Can create room
- [ ] Can join room with code
- [ ] Can add songs to queue
- [ ] Can vote on songs (democratic mode)
- [ ] Real-time updates work (test with 2 windows)
- [ ] Host controls work (play/pause/skip)

---

## 📊 Verify Everything is Working

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Check MongoDB

```bash
# Connect to MongoDB
mongosh

# Use the database
use groovly

# Check collections
show collections

# Should see: users, rooms, songs
```

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** `MongoDB connection failed`
```bash
# Solution: Start MongoDB
brew services start mongodb-community
# Or
mongod --dbpath /usr/local/var/mongodb
```

**Problem:** `Port 5000 already in use`
```bash
# Solution: Change port in .env
PORT=5001
# Also update frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

### Frontend won't start

**Problem:** `Port 3000 already in use`
```bash
# Solution: Kill the process or use different port
npx kill-port 3000
# Or run on different port
PORT=3001 npm run dev
```

**Problem:** `Module not found` errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Socket.io not connecting

**Problem:** Real-time updates not working
```bash
# Check browser console for errors
# Verify backend is running
# Check CORS settings in backend
# Try refreshing the page
```

### Can't login after creating account

**Problem:** 401 Unauthorized
```bash
# Check backend logs
# Verify JWT_SECRET is set in backend .env
# Clear localStorage in browser
# Try creating new account
```

---

## 🎨 UI Overview

### Landing Page
- Beautiful gradient design
- Sign up / Login buttons
- Feature showcase

### Dashboard
- **Create Room** - Start new music session
- **Join Room** - Enter with 6-character code
- Clean, modern interface

### Room Interface
- **Header** - Room name, code, mode, member count
- **Now Playing** - Current song with album art
- **Queue** - List of queued songs with voting
- **Sidebar** - Members list
- **Host Controls** - Play/Pause/Skip (host only)

---

## 📱 Features to Try

### Democratic Mode
1. Add multiple songs
2. Upvote your favorites
3. Watch queue reorder by vote score
4. Songs with most votes play first

### DJ Mode
1. Create room in DJ mode
2. Only host can control queue order
3. Members can add but not vote
4. Perfect for curated playlists

### Auto-Play Mode
1. Create room in auto-play mode
2. Songs play in order added (FIFO)
3. No voting influence
4. Simple background music mode

---

## 🔑 Default Test Accounts

You can create these for testing:

**Account 1 (Host):**
- Email: host@groovly.com
- Password: password123

**Account 2 (Member):**
- Email: member@groovly.com
- Password: password123

---

## 🚀 Next Steps

Now that everything is running:

1. ✅ **Explore the UI** - Try all features
2. ✅ **Test with friends** - Share room codes
3. ✅ **Customize** - Modify colors, add features
4. ✅ **Add Spotify** - Integrate Spotify API for real songs
5. ✅ **Deploy** - Deploy to production (Vercel + Railway)

---

## 📚 Additional Resources

- **Full Architecture**: See `ARCHITECTURE.md`
- **Backend API Docs**: See `M-Backend/README.md`
- **Frontend Docs**: See `M-Frontend/groovly-landing/README_FRONTEND.md`

---

## 💡 Pro Tips

1. **Use Chrome DevTools** - Network tab shows API calls
2. **Open multiple windows** - Test real-time features
3. **Check browser console** - See Socket.io events
4. **Monitor backend logs** - See incoming requests
5. **Use Postman** - Test API endpoints directly

---

## 🎉 You're All Set!

Everything should be working perfectly now. Have fun building and customizing your collaborative music platform!

**Questions?** Check the detailed documentation or create an issue.

**Happy Coding! 🎵🎉**
