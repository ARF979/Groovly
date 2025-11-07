# 🗺️ Groovly - Frontend Sitemap & Page Structure

## Page Hierarchy

```
/
├── / (Landing Page)
│   ├── Hero Section
│   ├── Features Section
│   ├── What is Groovly Section
│   └── Navigation → Login | Sign Up
│
├── /auth
│   ├── /auth/login
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Login Button
│   │   └── Link to Register
│   │
│   └── /auth/register
│       ├── Name Input
│       ├── Email Input
│       ├── Password Input
│       ├── Confirm Password Input
│       ├── Sign Up Button
│       └── Link to Login
│
├── /dashboard (Protected)
│   ├── Welcome Header
│   ├── User Info Display
│   ├── Create Room Card → Opens Modal
│   │   └── CreateRoomModal
│   │       ├── Room Name Input
│   │       ├── Mode Selection (Radio)
│   │       │   ├── Democratic
│   │       │   ├── DJ Mode
│   │       │   └── Auto-play
│   │       └── Create Button → /room/[id]
│   │
│   └── Join Room Card → Opens Modal
│       └── JoinRoomModal
│           ├── Room Code Input (6 chars)
│           └── Join Button → /room/[id]
│
└── /room/[id] (Protected)
    ├── Header
    │   ├── Room Name
    │   ├── Room Code (shareable)
    │   ├── Room Mode
    │   ├── Member Count
    │   ├── Close Room Button (Host only)
    │   └── Leave Room Button
    │
    ├── Main Content Area
    │   ├── Now Playing Section
    │   │   ├── Album Art
    │   │   ├── Song Title
    │   │   ├── Artist Name
    │   │   └── Host Controls (Host only)
    │   │       ├── Play/Pause Button
    │   │       └── Skip Button
    │   │
    │   ├── Queue Header
    │   │   ├── "Queue" Title
    │   │   └── Add Song Button → Opens Modal
    │   │       └── AddSongModal
    │   │           ├── Song Title Input
    │   │           ├── Artist Input
    │   │           ├── Album Input
    │   │           ├── Spotify ID Input
    │   │           └── Add Button
    │   │
    │   └── Queue List
    │       └── Song Cards (each)
    │           ├── Position Number
    │           ├── Album Art
    │           ├── Song Title
    │           ├── Artist Name
    │           ├── Voting Buttons (Democratic mode)
    │           │   ├── Upvote Button
    │           │   ├── Vote Score
    │           │   └── Downvote Button
    │           └── Remove Button (if added by user)
    │
    └── Sidebar
        └── Members List
            ├── "Members (X)" Header
            └── Member Cards (each)
                ├── Avatar (initial)
                ├── Name
                └── "Host" Badge (if host)
```

## Component Breakdown

### Page Components

#### 1. Landing Page (`/`)
**File**: `app/page.tsx`
**Status**: ✅ Updated with auth links
**Features**:
- Hero with dynamic text
- Scattered CD components
- Feature showcase
- CTA buttons → Login/Register

---

#### 2. Login Page (`/auth/login`)
**File**: `app/auth/login/page.tsx`
**Status**: ✅ Complete
**Features**:
- Email/password form
- Error handling
- Auto-redirect to dashboard
- Link to register

**Form Fields**:
- Email (required, validated)
- Password (required, min 6 chars)

**Actions**:
- Login → Dashboard
- Link to Register → `/auth/register`
- Back to Home → `/`

---

#### 3. Register Page (`/auth/register`)
**File**: `app/auth/register/page.tsx`
**Status**: ✅ Complete
**Features**:
- Full registration form
- Password confirmation
- Client-side validation
- Auto-login after registration

**Form Fields**:
- Name (required)
- Email (required, validated)
- Password (required, min 6 chars)
- Confirm Password (must match)

**Actions**:
- Register → Auto-login → Dashboard
- Link to Login → `/auth/login`
- Back to Home → `/`

---

#### 4. Dashboard (`/dashboard`)
**File**: `app/dashboard/page.tsx`
**Status**: ✅ Complete
**Protection**: Requires authentication
**Features**:
- Welcome message
- User info display
- Create room action
- Join room action

**Modals**:

**CreateRoomModal**:
- Room name input
- Mode selection:
  - ✅ Democratic (default)
  - ✅ DJ Mode
  - ✅ Auto-play
- Creates room → Redirects to room page

**JoinRoomModal**:
- 6-character code input
- Auto-uppercase
- Joins room → Redirects to room page

---

#### 5. Room Page (`/room/[id]`)
**File**: `app/room/[id]/page.tsx`
**Status**: ✅ Complete
**Protection**: Requires authentication + room membership
**Features**:
- Real-time Socket.io connection
- Live queue updates
- Member presence
- Playback synchronization

**Sub-Components**:

**NowPlaying**:
- Shows current playing song
- Album art display
- Host playback controls
  - Play button
  - Pause button
  - Skip button

**QueueList**:
- Displays all queued songs
- Sort by votes (democratic) or FIFO
- Vote buttons (democratic mode)
- Remove button (for song owner)
- Real-time updates

**MembersList**:
- Shows all room members
- Avatar (first letter)
- Name
- Host badge
- Real-time join/leave

**AddSongModal**:
- Manual song entry form
- Title, artist, album fields
- Spotify ID (auto-generated if empty)
- Adds to queue via API

---

## State Management

### Global State (Zustand)
**File**: `src/store/authStore.ts`
```typescript
{
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  Actions:
  - login(email, password)
  - register(name, email, password)
  - logout()
  - loadUser()
}
```

### Local State (Component Level)

**Dashboard**:
- `showCreateModal: boolean`
- `showJoinModal: boolean`

**Room Page**:
- `room: Room | null`
- `queue: Song[]`
- `isLoading: boolean`
- `error: string`
- `showAddSong: boolean`

**Modals**:
- Form data states
- Loading states
- Error states

---

## User Flows

### Flow 1: New User Registration
```
Landing → Sign Up → Register Form → Submit
    ↓
Backend validates → Creates user → Returns token
    ↓
Store token → Set user in state → Redirect to Dashboard
```

### Flow 2: Existing User Login
```
Landing → Login → Login Form → Submit
    ↓
Backend validates → Returns token
    ↓
Store token → Set user in state → Redirect to Dashboard
```

### Flow 3: Create & Host Room
```
Dashboard → Create Room → Modal Opens → Fill Form → Submit
    ↓
Backend creates room → Returns room data
    ↓
Redirect to /room/[id]
    ↓
Socket connects → Join room channel
    ↓
Fetch room data & queue → Render UI
    ↓
Host can control playback
```

### Flow 4: Join Existing Room
```
Dashboard → Join Room → Modal Opens → Enter Code → Submit
    ↓
Backend validates code → Adds user to members
    ↓
Redirect to /room/[id]
    ↓
Socket connects → Join room channel
    ↓
Fetch room data & queue → Render UI
    ↓
Member can add songs & vote
```

### Flow 5: Add Song to Queue
```
Room Page → Add Song Button → Modal Opens → Fill Form → Submit
    ↓
API: POST /api/rooms/[roomId]/songs
    ↓
Backend creates song → Socket emits 'queue-updated'
    ↓
All clients receive event → Re-fetch queue → UI updates
```

### Flow 6: Vote on Song (Democratic Mode)
```
Room Page → Click Upvote/Downvote on Song
    ↓
API: POST /api/rooms/[roomId]/songs/[songId]/upvote
    ↓
Backend updates song votes → Socket emits 'song-updated'
    ↓
All clients receive event → Update song in queue → Re-sort → UI updates
```

### Flow 7: Host Controls Playback
```
Room Page (Host) → Click Play/Pause/Skip
    ↓
Socket emit: 'host-play' / 'host-pause' / 'host-skip'
    ↓
Backend validates host → Updates playback state → Broadcasts to all
    ↓
All clients receive 'playback-state' event → UI updates synchronously
```

---

## Protected Routes

### Authentication Check
```typescript
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
  }
}, [isLoading, isAuthenticated]);
```

**Protected Pages**:
- `/dashboard` - Requires authentication
- `/room/[id]` - Requires authentication + room membership

**Public Pages**:
- `/` - Landing page
- `/auth/login` - Login
- `/auth/register` - Register

---

## Socket.io Connection Lifecycle

### On Room Page Mount
```
1. User authenticated → Get token
2. Socket service connects with token
3. Emit 'join-room' with roomId
4. Listen for all room events
5. Set up event handlers
```

### Active Listeners (in room)
- `queue-updated` → Refresh queue
- `song-updated` → Update song votes
- `playback-state` → Sync playback
- `member-joined` → Refresh members
- `member-left` → Refresh members
- `error` → Show error message
- `room-closed` → Redirect to dashboard

### On Room Page Unmount
```
1. Emit 'leave-room'
2. Remove all event listeners
3. Keep socket connected (for navigation)
```

---

## Navigation Map

```
┌─────────────┐
│   Landing   │
└─────┬───────┘
      │
      ├─── Login ──────┐
      │                │
      └─── Register ───┤
                       │
                       ↓
                 ┌──────────┐
                 │ Dashboard│
                 └─────┬────┘
                       │
                       ├─── Create Room ───┐
                       │                   │
                       └─── Join Room ─────┤
                                           │
                                           ↓
                                    ┌─────────────┐
                                    │  Room [id]  │
                                    └─────┬───────┘
                                          │
                                          ├─── Leave → Dashboard
                                          │
                                          └─── Close (Host) → Dashboard
```

---

## Responsive Breakpoints

All pages are responsive with Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile First Design**:
- Single column on mobile
- Grid layouts on tablet+
- Side-by-side on desktop

---

## Color Scheme

```css
Primary: Purple (#A855F7, #9333EA)
Secondary: Pink (#EC4899, #DB2777)
Accent: Orange (#FB923C)
Background: Black (#000000)
Surface: Dark Gray (#18181B with opacity)
Text: White (#FFFFFF)
Muted: Gray (#A1A1AA)
Border: White with 10% opacity
```

---

## Key Features Summary

✅ **Completed Features**:
- User authentication (login/register)
- Room creation with modes
- Join room by code
- Real-time queue updates
- Democratic voting system
- Host playback controls
- Add songs to queue
- Members list
- Leave/close room
- Socket.io real-time sync

🚧 **Future Enhancements**:
- Spotify API integration
- Search songs interface
- User profiles & avatars
- Room settings panel
- History/analytics
- Mini-games
- Social sharing

---

This sitemap provides a complete overview of the frontend architecture and user flows!
