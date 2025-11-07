# 📂 Groovly - Complete File Structure

## Overview

This document provides a complete view of all files in the Groovly project.

---

## Root Directory Structure

```
M/
│
├── 📄 README.md                    # Main project README
├── 📄 INDEX.md                     # Documentation navigation
├── 📄 QUICKSTART.md                # 5-minute setup guide
├── 📄 PROJECT_SUMMARY.md           # Project overview
├── 📄 ARCHITECTURE.md              # System architecture
├── 📄 SYSTEM_DIAGRAM.md            # Visual diagrams
├── 📄 TESTING_GUIDE.md             # Testing procedures
│
├── 📁 M-Backend/                   # Backend Application
│   │
│   ├── 📄 README.md                # Backend documentation
│   ├── 📄 DEPLOYMENT.md            # Deployment guide
│   ├── 📄 QUICKSTART.md            # Backend quickstart
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 .env                     # Environment variables (create this)
│   ├── 📄 .gitignore               # Git ignore rules
│   │
│   ├── 📁 src/                     # Source code
│   │   │
│   │   ├── 📄 app.js               # Express app setup
│   │   ├── 📄 server.js            # Server entry point
│   │   │
│   │   ├── 📁 config/              # Configuration
│   │   │   ├── 📄 constants.js     # App constants
│   │   │   └── 📄 database.js      # MongoDB connection
│   │   │
│   │   ├── 📁 controllers/         # Business logic
│   │   │   ├── 📄 authController.js    # Authentication
│   │   │   ├── 📄 roomController.js    # Room management
│   │   │   └── 📄 songController.js    # Song operations
│   │   │
│   │   ├── 📁 middleware/          # Express middleware
│   │   │   ├── 📄 auth.js              # JWT authentication
│   │   │   ├── 📄 errorHandler.js      # Error handling
│   │   │   ├── 📄 roomAuth.js          # Room authorization
│   │   │   └── 📄 validate.js          # Input validation
│   │   │
│   │   ├── 📁 models/              # MongoDB schemas
│   │   │   ├── 📄 User.js              # User model
│   │   │   ├── 📄 Room.js              # Room model
│   │   │   └── 📄 Song.js              # Song model
│   │   │
│   │   ├── 📁 routes/              # API routes
│   │   │   ├── 📄 index.js             # Route aggregator
│   │   │   ├── 📄 authRoutes.js        # Auth routes
│   │   │   ├── 📄 roomRoutes.js        # Room routes
│   │   │   └── 📄 songRoutes.js        # Song routes
│   │   │
│   │   ├── 📁 socket/              # Socket.io
│   │   │   ├── 📄 socketAuth.js        # Socket authentication
│   │   │   └── 📄 socketHandlers.js    # Event handlers
│   │   │
│   │   ├── 📁 utils/               # Utilities
│   │   │   └── 📄 helpers.js           # Helper functions
│   │   │
│   │   └── 📁 __tests__/           # Tests
│   │       ├── 📄 room.test.js         # Room tests
│   │       └── 📄 voting.test.js       # Voting tests
│   │
│   └── 📁 node_modules/            # Dependencies (gitignored)
│
└── 📁 M-Frontend/                  # Frontend Application
    │
    ├── 📄 SITEMAP.md               # Page structure
    │
    └── 📁 groovly-landing/         # Next.js app
        │
        ├── 📄 README.md            # Original Next.js README
        ├── 📄 README_FRONTEND.md   # Frontend documentation
        ├── 📄 package.json         # Dependencies
        ├── 📄 .env.local           # Environment variables (created)
        ├── 📄 .gitignore           # Git ignore rules
        ├── 📄 next.config.mjs      # Next.js config
        ├── 📄 tailwind.config.js   # Tailwind config
        ├── 📄 postcss.config.js    # PostCSS config
        ├── 📄 tsconfig.json        # TypeScript config
        ├── 📄 next-env.d.ts        # Next.js types
        │
        ├── 📁 app/                 # Next.js App Router
        │   │
        │   ├── 📄 layout.tsx       # Root layout
        │   ├── 📄 page.tsx         # Landing page (updated)
        │   │
        │   ├── 📁 auth/            # Authentication
        │   │   ├── 📁 login/
        │   │   │   └── 📄 page.tsx     # Login page ✨ NEW
        │   │   └── 📁 register/
        │   │       └── 📄 page.tsx     # Register page ✨ NEW
        │   │
        │   ├── 📁 dashboard/       # Dashboard
        │   │   └── 📄 page.tsx         # Dashboard page ✨ NEW
        │   │
        │   └── 📁 room/            # Room interface
        │       └── 📁 [id]/
        │           └── 📄 page.tsx     # Room page ✨ NEW
        │
        ├── 📁 src/                 # Source code
        │   │
        │   ├── 📁 components/      # React components
        │   │   ├── 📄 AlternatingRow.tsx  # Existing component
        │   │   ├── 📄 CD.tsx              # Existing component
        │   │   └── 📄 HeroDynamicText.tsx # Existing component
        │   │
        │   ├── 📁 config/          # Configuration ✨ NEW
        │   │   └── 📄 constants.ts     # API endpoints, constants
        │   │
        │   ├── 📁 lib/             # Libraries ✨ NEW
        │   │   ├── 📄 api.ts           # Axios instance
        │   │   └── 📄 socket.ts        # Socket.io service
        │   │
        │   ├── 📁 store/           # State management ✨ NEW
        │   │   └── 📄 authStore.ts     # Zustand auth store
        │   │
        │   └── 📁 types/           # TypeScript types ✨ NEW
        │       └── 📄 index.ts         # Type definitions
        │
        ├── 📁 styles/              # Global styles
        │   └── 📄 globals.css      # Global CSS
        │
        ├── 📁 public/              # Static assets
        │   └── 📁 assets/
        │       └── 📄 README.txt   # Assets info
        │
        └── 📁 node_modules/        # Dependencies (gitignored)
```

---

## File Counts by Type

### Backend
```
📊 Total Files: ~30

Controllers:     3 files
Models:          3 files
Routes:          4 files
Middleware:      4 files
Socket:          2 files
Config:          2 files
Tests:           2 files
Documentation:   3 files
Configuration:   5 files (package.json, .env, etc.)
```

### Frontend
```
📊 Total Files: ~35

Pages:           5 files (app router)
Components:      3+ files
Services:        2 files (lib/)
State:           1 file (store/)
Types:           1 file
Config:          2 files
Styles:          1 file
Documentation:   2 files
Configuration:   7 files (configs, package.json, etc.)
```

### Documentation
```
📊 Total Files: 8

Root Level:      7 files
Frontend:        1 file
Backend:         Included in backend count
```

---

## New Files Created

### ✨ Frontend Files (17 new files)

#### Pages (5)
1. `app/auth/login/page.tsx` - Login page
2. `app/auth/register/page.tsx` - Register page
3. `app/dashboard/page.tsx` - Dashboard with room actions
4. `app/room/[id]/page.tsx` - Room interface with queue
5. `app/page.tsx` - Updated landing page

#### Infrastructure (7)
6. `src/config/constants.ts` - API endpoints & constants
7. `src/lib/api.ts` - Axios client with interceptors
8. `src/lib/socket.ts` - Socket.io service
9. `src/store/authStore.ts` - Zustand auth store
10. `src/types/index.ts` - TypeScript type definitions
11. `.env.local` - Environment variables
12. `README_FRONTEND.md` - Frontend documentation

### 📚 Documentation Files (7 new files)

13. `README.md` - Main project README
14. `INDEX.md` - Documentation index
15. `QUICKSTART.md` - Quick start guide
16. `PROJECT_SUMMARY.md` - Project summary
17. `ARCHITECTURE.md` - System architecture
18. `SYSTEM_DIAGRAM.md` - Visual diagrams
19. `TESTING_GUIDE.md` - Testing guide
20. `M-Frontend/SITEMAP.md` - Frontend sitemap
21. `FILE_STRUCTURE.md` - This file

**Total New Files: 24**

---

## File Sizes (Approximate)

### Large Files (>500 lines)
- `app/room/[id]/page.tsx` - ~600 lines (comprehensive room UI)
- `app/dashboard/page.tsx` - ~300 lines (with modals)
- `ARCHITECTURE.md` - ~900 lines
- `TESTING_GUIDE.md` - ~800 lines
- `SYSTEM_DIAGRAM.md` - ~600 lines

### Medium Files (100-500 lines)
- `src/store/authStore.ts` - ~100 lines
- `src/types/index.ts` - ~150 lines
- `app/auth/login/page.tsx` - ~130 lines
- `app/auth/register/page.tsx` - ~170 lines
- `QUICKSTART.md` - ~400 lines
- `PROJECT_SUMMARY.md` - ~500 lines

### Small Files (<100 lines)
- `src/config/constants.ts` - ~80 lines
- `src/lib/api.ts` - ~50 lines
- `src/lib/socket.ts` - ~70 lines
- `.env.local` - 3 lines

---

## Code Statistics

```
Language         Files    Lines    Percentage
────────────────────────────────────────────
TypeScript       12       ~3,500   60%
Markdown         8        ~4,000   30%
JavaScript       15       ~2,000   10%
────────────────────────────────────────────
Total                     ~9,500   100%
```

---

## Key Directories Explained

### `/app` (Frontend Pages)
Next.js 14 App Router pages. Each folder represents a route.

### `/src` (Frontend Source)
Reusable code: components, utilities, services, types.

### `/src/controllers` (Backend)
Business logic for handling requests.

### `/src/models` (Backend)
MongoDB schema definitions with Mongoose.

### `/src/routes` (Backend)
Express route definitions and middleware.

### `/src/socket` (Backend)
Socket.io event handlers for real-time features.

---

## Important Files

### Configuration Files
```
M-Backend/.env              Backend environment variables
M-Frontend/.env.local       Frontend environment variables
tailwind.config.js          Tailwind CSS customization
tsconfig.json               TypeScript configuration
next.config.mjs             Next.js configuration
package.json (x2)           Dependencies for both apps
```

### Entry Points
```
M-Backend/src/server.js           Backend server start
M-Frontend/app/layout.tsx         Frontend root layout
M-Frontend/app/page.tsx           Frontend homepage
```

### Documentation Index
```
README.md                   Main entry point
INDEX.md                    Documentation navigation
QUICKSTART.md               Setup guide
ARCHITECTURE.md             System design
```

---

## Git Structure

### Tracked Files
- All source code (`.ts`, `.tsx`, `.js`)
- All documentation (`.md`)
- Configuration files
- Public assets
- Package.json files

### Ignored Files (`.gitignore`)
- `node_modules/`
- `.env` (backend - has example)
- `.env.local` (frontend)
- `.next/` (build output)
- `build/`
- `dist/`
- `.DS_Store`
- `*.log`

---

## Dependencies Overview

### Frontend Dependencies (22 packages)
```json
{
  "next": "^14.2.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.4.5",
  "tailwindcss": "^3.4.3",
  "axios": "latest",           // ✨ Added
  "socket.io-client": "latest", // ✨ Added
  "zustand": "latest",          // ✨ Added
  "clsx": "^2.0.0",
  "framer-motion": "^11.0.0"
}
```

### Backend Dependencies (~20 packages)
```json
{
  "express": "^4.18.x",
  "mongoose": "^7.x",
  "socket.io": "^4.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "express-validator": "^7.x",
  "helmet": "^7.x",
  "cors": "^2.x",
  "dotenv": "^16.x"
}
```

---

## Build Outputs (Not in Git)

### Frontend Build
```
.next/                      Next.js build output
out/                        Static export (if used)
node_modules/               Dependencies
```

### Backend
```
node_modules/               Dependencies
dist/                       Compiled JS (if TypeScript)
coverage/                   Test coverage
```

---

## Environment Files

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/groovly
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## File Permissions

### Backend
- `server.js` - Executable entry point
- All `.js` files - Read/write
- `.env` - Read only, not in git

### Frontend
- All `.tsx/.ts` files - Read/write
- `node_modules/` - Read/execute
- `.env.local` - Read only, not in git

---

## Backup Strategy

### Critical Files to Backup
1. Source code (`src/`, `app/`)
2. Configuration (`package.json`, configs)
3. Documentation (`.md` files)
4. Environment templates (`.env.example`)

### Files NOT to Backup
- `node_modules/` (regenerate with `npm install`)
- Build outputs (`.next/`, `dist/`)
- Logs
- Cache files

---

## Navigation Tips

### Finding Files

**Looking for a page?**
→ `M-Frontend/groovly-landing/app/`

**Looking for a component?**
→ `M-Frontend/groovly-landing/src/components/`

**Looking for API endpoint?**
→ `M-Backend/src/routes/`

**Looking for database model?**
→ `M-Backend/src/models/`

**Looking for documentation?**
→ Root level `.md` files

---

## Summary

- **Total Files**: ~80 files
- **New Files Created**: 24 files
- **Lines of Code**: ~9,500 lines
- **Documentation**: ~4,000 lines
- **Languages**: TypeScript, JavaScript, Markdown
- **Frameworks**: Next.js, Express.js
- **Database**: MongoDB

Everything is organized, documented, and ready for development! 🚀
