# 🎵 Groovly - Collaborative Music Platform

<div align="center">

![Groovly](https://img.shields.io/badge/Groovly-Music%20Platform-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Turn any gathering into a collaborative concert**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 What is Groovly?

Groovly is a **real-time collaborative music platform** that lets groups of people create shared playlists, vote on songs, and control music together. Perfect for parties, road trips, workplaces, or any gathering where music matters.

### ✨ Key Features

- 🎧 **Real-time Queue** - Everyone sees the same queue, updated instantly
- 🗳️ **Democratic Voting** - Upvote/downvote songs to influence playback order
- 👑 **Host Controls** - Room host can play, pause, and skip songs
- 🎮 **Multiple Modes** - Democratic, DJ Mode, or Auto-play
- 📱 **Responsive Design** - Beautiful UI on mobile, tablet, and desktop
- ⚡ **Socket.io Powered** - Sub-second real-time synchronization
- 🔐 **Secure Auth** - JWT-based authentication

---

## 🚀 Quick Start

Get Groovly running in **5 minutes**:

```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Start Backend (Terminal 1)
cd M-Backend
npm install
npm run dev
# ✓ Running on http://localhost:5000

# 3. Start Frontend (Terminal 2)
cd M-Frontend/groovly-landing
npm install
npm run dev
# ✓ Running on http://localhost:3000

# 4. Open http://localhost:3000 in your browser 🎉
```

**📖 Detailed Setup:** See [QUICKSTART.md](QUICKSTART.md)

---

## 📸 Screenshots

### Landing Page
Beautiful gradient design with feature showcase

### Dashboard
Create or join rooms with simple interface

### Room Interface
Real-time queue with voting and playback controls

---

## 🎯 Use Cases

- **House Parties** - Let guests influence the music
- **Road Trips** - Everyone adds their favorites
- **Office Spaces** - Collaborative background music
- **Gym/Yoga Studios** - Member-driven playlists
- **Coffee Shops** - Customer requests
- **Events** - Interactive music experience

---

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  Next.js    │◄───────►│  Express.js │◄───────►│  MongoDB    │
│  Frontend   │         │  Backend    │         │  Database   │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
  Port: 3000              Port: 5000              Port: 27017
      │                       │
      │                       │
      └───────Socket.io───────┘
          Real-time Sync
```

**See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system design**

---

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP:** Axios
- **Real-time:** Socket.io Client

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.io
- **Auth:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** bcryptjs, helmet, cors

---

## 📁 Project Structure

```
M/
├── M-Backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io handlers
│   │   ├── middleware/     # Auth, validation
│   │   └── config/         # Configuration
│   ├── .env                # Environment variables
│   └── package.json
│
├── M-Frontend/             # Next.js Application
│   └── groovly-landing/
│       ├── app/            # Pages (App Router)
│       │   ├── auth/       # Login/Register
│       │   ├── dashboard/  # Main hub
│       │   └── room/[id]/  # Room interface
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── lib/        # API & Socket services
│       │   ├── store/      # Zustand stores
│       │   ├── types/      # TypeScript types
│       │   └── config/     # Constants
│       └── package.json
│
└── Documentation/          # Comprehensive docs
    ├── QUICKSTART.md       # 5-minute setup
    ├── ARCHITECTURE.md     # System design
    ├── TESTING_GUIDE.md    # QA procedures
    └── INDEX.md            # Doc navigation
```

---

## 🔑 Core Features

### Authentication
- User registration with email/password
- JWT token-based authentication
- Secure password hashing
- Auto-login after registration
- Protected routes

### Room Management
- Create rooms with unique 6-character codes
- Three room modes:
  - **Democratic**: Songs ordered by votes
  - **DJ Mode**: Host controls queue order
  - **Auto-play**: First-in-first-out
- Join rooms via code
- Leave/close rooms
- Member presence tracking

### Song Queue
- Add songs to queue
- Real-time queue updates
- Vote on songs (democratic mode)
- Remove own songs
- Auto-sort by votes
- Queue history

### Host Controls
- Play/pause playback
- Skip songs
- Seek to position
- Control playback state
- Synchronized across all members

### Real-time Features
- Live queue updates
- Instant vote synchronization
- Member join/leave notifications
- Playback state sync
- Sub-second latency

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[INDEX.md](INDEX.md)** | Documentation navigation |
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute setup guide |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Project overview |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | Testing procedures |
| **[Frontend README](M-Frontend/groovly-landing/README_FRONTEND.md)** | Frontend guide |
| **[Frontend SITEMAP](M-Frontend/SITEMAP.md)** | Page structure |
| **[Backend README](M-Backend/README.md)** | Backend API docs |

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Backend tests
cd M-Backend
npm test

# Manual testing
# See TESTING_GUIDE.md for 50+ test scenarios
```

**Coverage:**
- Authentication flows
- Room management
- Queue operations
- Voting system
- Real-time sync
- Error handling
- UI/UX

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd M-Frontend/groovly-landing
vercel deploy
```

### Backend (Railway/Heroku)
```bash
cd M-Backend
git push railway main
```

### Database (MongoDB Atlas)
- Create cluster
- Get connection string
- Update MONGODB_URI

**See [ARCHITECTURE.md](ARCHITECTURE.md#deployment) for details**

---

## 🔐 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Protected routes
- ✅ Socket authentication
- ✅ XSS protection

---

## 🎨 Customization

### Theme
Colors are easily customizable in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      purple: { 400: '#A855F7', 500: '#9333EA' },
      pink: { 400: '#EC4899', 500: '#DB2777' },
      // Customize these!
    }
  }
}
```

### Room Settings
Default settings in `src/config/constants.ts`:

```javascript
DEFAULT_ROOM_SETTINGS: {
  skipThreshold: 50,      // % of members needed to skip
  maxQueueSize: 100,      // Max songs in queue
  maxSongsPerUser: 5,     // Per user limit
  allowDuplicates: false, // Prevent duplicate songs
  allowExplicit: true     // Allow explicit content
}
```

---

## 🛣️ Roadmap

### Phase 1: MVP ✅ COMPLETE
- ✅ User authentication
- ✅ Room management
- ✅ Queue & voting
- ✅ Host controls
- ✅ Real-time sync

### Phase 2: Spotify Integration
- [ ] Spotify API integration
- [ ] Song search
- [ ] Playlist import/export
- [ ] Preview playback

### Phase 3: Social Features
- [ ] User profiles & avatars
- [ ] Friend system
- [ ] Room analytics
- [ ] Social sharing

### Phase 4: Gamification
- [ ] Guess the Song game
- [ ] DJ battles
- [ ] Leaderboards
- [ ] Achievements

### Phase 5: Mobile
- [ ] React Native app
- [ ] Push notifications
- [ ] Offline mode
- [ ] App Store/Play Store

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (see TESTING_GUIDE.md)
5. Submit a pull request

**Code Style:**
- Follow existing patterns
- Use TypeScript
- Write clear comments
- Update documentation

---

## 📝 License

MIT License - feel free to use for personal or commercial projects

---

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Express.js
- MongoDB
- Socket.io
- Tailwind CSS
- And many other amazing open-source tools

---

## 📞 Support

- **Documentation:** See [INDEX.md](INDEX.md)
- **Setup Issues:** See [QUICKSTART.md](QUICKSTART.md#troubleshooting)
- **Bug Reports:** Open an issue
- **Questions:** Check [TESTING_GUIDE.md](TESTING_GUIDE.md#common-issues)

---

## 📊 Stats

- **Frontend Pages:** 5
- **API Endpoints:** 15+
- **Socket Events:** 12
- **Tests:** 50+
- **Documentation:** ~50 pages
- **Type Coverage:** 100%

---

## 🌟 Star Us!

If you find Groovly useful, please star the repository!

---

<div align="center">

**Made with ❤️ for collaborative music experiences**

[Get Started](QUICKSTART.md) • [Read Docs](INDEX.md) • [View Demo](#)

</div>
