# Groovly Frontend

A Next.js frontend application for Groovly - a collaborative music experience platform.

## 🚀 Features

- **User Authentication**: Login and registration with JWT
- **Room Management**: Create and join music rooms with unique codes
- **Real-time Queue**: Live queue updates via Socket.io
- **Democratic Voting**: Upvote/downvote songs to influence playback order
- **Host Controls**: Room hosts can control playback (play, pause, skip)
- **Multiple Room Modes**: Democratic, DJ Mode, and Auto-play
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## 📋 Prerequisites

- Node.js >= 16.x
- npm or yarn
- Backend API running (see M-Backend README)

## 🛠️ Installation

1. **Navigate to the frontend directory**
   ```bash
   cd M-Frontend/groovly-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
groovly-landing/
├── app/                          # Next.js app directory
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── register/page.tsx    # Registration page
│   ├── dashboard/page.tsx       # User dashboard
│   ├── room/[id]/page.tsx       # Room interface with queue
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── src/
│   ├── components/              # Reusable components
│   │   ├── AlternatingRow.tsx
│   │   ├── CD.tsx
│   │   └── HeroDynamicText.tsx
│   ├── config/
│   │   └── constants.ts         # App constants and API endpoints
│   ├── lib/
│   │   ├── api.ts              # Axios instance and helpers
│   │   └── socket.ts           # Socket.io service
│   ├── store/
│   │   └── authStore.ts        # Zustand auth state management
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── styles/
│   └── globals.css             # Global styles
├── .env.local                  # Environment variables
├── next.config.mjs
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔑 Key Pages

### Landing Page (`/`)
- Introduction to Groovly
- Call-to-action buttons for sign up/login
- Feature showcase

### Authentication (`/auth/login`, `/auth/register`)
- User login and registration forms
- JWT token management
- Automatic redirect to dashboard on success

### Dashboard (`/dashboard`)
- Create new room
- Join existing room by code
- View user profile
- Protected route (requires authentication)

### Room Interface (`/room/[id]`)
- Real-time song queue
- Voting interface (democratic mode)
- Now playing display
- Host playback controls
- Members list
- Add song functionality
- Live Socket.io updates

## 🔌 API Integration

### REST API Endpoints

All API calls are made through the `api` utility in `src/lib/api.ts`:

```typescript
// Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

// Rooms
POST /api/rooms                    # Create room
GET  /api/rooms/:identifier        # Get room
POST /api/rooms/:code/join         # Join room
POST /api/rooms/:id/leave          # Leave room
DELETE /api/rooms/:id              # Close room (host)

// Songs
POST /api/rooms/:roomId/songs                    # Add song
POST /api/rooms/:roomId/songs/:songId/upvote     # Upvote
POST /api/rooms/:roomId/songs/:songId/downvote   # Downvote
DELETE /api/rooms/:roomId/songs/:songId          # Remove song
```

### Socket.io Events

#### Client to Server
- `join-room`: Join room's socket channel
- `leave-room`: Leave room's socket channel
- `upvote`: Upvote a song
- `downvote`: Downvote a song
- `host-play`: Start playback (host only)
- `host-pause`: Pause playback (host only)
- `host-skip`: Skip song (host only)

#### Server to Client
- `queue-updated`: Queue changed
- `song-updated`: Song votes changed
- `playback-state`: Playback state changed
- `member-joined`: Member joined room
- `member-left`: Member left room
- `error`: Error occurred
- `room-closed`: Room closed by host

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Fonts**: Inter (body), Poppins (display)
- **Theme**: Dark mode with purple/pink gradients
- **Components**: Custom styled with glassmorphism effects

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically included in API requests via Axios interceptor
5. Socket.io connects with token for authentication
6. Protected routes check authentication status

## 🚀 Deployment

### Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SOCKET_URL`
4. Deploy

## 📝 Development Notes

### State Management
- Uses **Zustand** for auth state
- Local component state for UI
- Socket.io events for real-time updates

### Type Safety
- Full TypeScript coverage
- Type definitions in `src/types/index.ts`
- Strict mode enabled

### Code Organization
- Components are functional with hooks
- API calls separated into `lib/api.ts`
- Socket service encapsulated in `lib/socket.ts`
- Constants centralized in `config/constants.ts`

## 🔄 Next Steps / Future Enhancements

- [ ] Spotify API integration for song search
- [ ] User avatars and profiles
- [ ] Room history and playlists export
- [ ] Mini-games (Guess the Song)
- [ ] Advanced room settings UI
- [ ] Mobile app (React Native)
- [ ] Social sharing features
- [ ] Analytics dashboard

## 🐛 Known Issues

- TypeScript route type warnings (Next.js type safety - can be ignored)
- Manual song entry required (Spotify integration pending)

## 📮 Support

For issues and questions, please refer to the main project repository.

---

**Happy Vibing! 🎵🎉**
