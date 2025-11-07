# 🎵 Spotify Integration Setup Guide

## ✅ What's Been Integrated

Groovly now has **full Spotify integration** with the following features:

### Backend (Complete)
- ✅ Spotify search endpoint (`/api/spotify/search`)
- ✅ Get track details (`/api/spotify/track/:id`)
- ✅ Get recommendations (`/api/spotify/recommendations/:id`)
- ✅ Automatic token refresh
- ✅ Error handling and rate limiting

### Frontend (Complete)
- ✅ Modern search modal with real-time Spotify search
- ✅ Display album artwork
- ✅ One-click song addition from search results
- ✅ Fallback to manual entry if Spotify not configured

---

## 🚀 Quick Start

### Step 1: Get Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (free or premium)
3. Click **"Create an App"**
4. Fill in:
   - **App Name**: `Groovly` (or any name)
   - **App Description**: `Collaborative Music Platform`
   - **Redirect URI**: `http://localhost:3000/auth/spotify/callback`
5. Click **"Save"**
6. You'll see your **Client ID** and **Client Secret**

### Step 2: Update Backend .env File

Open `/M-Backend/.env` and replace the Spotify credentials:

```env
# Spotify API
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback
```

### Step 3: Restart Backend

```bash
cd M-Backend
# The server will auto-refresh tokens
node src/server.js
```

### Step 4: Test It!

1. Open Groovly in your browser: `http://localhost:3000`
2. Create or join a room
3. Click **"+ Add Song"**
4. Search for any song (e.g., "Bohemian Rhapsody")
5. See real results with album art!
6. Click **"Add"** to add to queue

---

## 🎯 Features Breakdown

### Search Functionality
```
User types: "bohemian rhapsody"
  ↓
Frontend sends: GET /api/spotify/search?q=bohemian+rhapsody
  ↓
Backend searches Spotify
  ↓
Returns: Array of tracks with:
  - Title, Artist, Album
  - Album artwork (high quality)
  - Duration
  - Preview URL (30-second clip)
  - Spotify ID
```

### What You Get
- ✅ **Professional data**: Real song info from Spotify's catalog
- ✅ **Album artwork**: High-quality cover art displayed in queue
- ✅ **Accurate metadata**: Correct titles, artists, durations
- ✅ **Preview URLs**: 30-second clips (playable in future update)
- ✅ **Popularity scores**: See how popular songs are
- ✅ **Explicit tag**: Know if songs have explicit content

---

## 🔑 API Endpoints Added

### 1. Search Tracks
```http
GET /api/spotify/search?q=query&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "spotifyId": "3z8h0TU7ReDPLIbEnYhWZb",
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "album": "A Night At The Opera",
      "albumArt": "https://...",
      "durationMs": 354000,
      "previewUrl": "https://...",
      "explicit": false,
      "popularity": 89
    }
  ],
  "count": 10
}
```

### 2. Get Track Details
```http
GET /api/spotify/track/:spotifyId
Authorization: Bearer <token>
```

### 3. Get Recommendations
```http
GET /api/spotify/recommendations/:spotifyId?limit=10
Authorization: Bearer <token>
```

---

## 🎨 Frontend Changes

### Updated Add Song Modal
- **Search bar**: Type and search Spotify instantly
- **Search results**: Cards with album art, title, artist
- **One-click add**: Hover over result and click "Add"
- **Loading states**: Smooth searching indicator
- **Error handling**: Graceful fallback if Spotify unavailable

### Before vs After

**Before (Manual Entry):**
```
User fills form:
  - Song Title: [input]
  - Artist: [input]  
  - Album: [input]
  
→ Generates manual-123456 ID
→ No album art
```

**After (Spotify Search):**
```
User searches: "mr brightside"
  ↓
See results with album art
  ↓
Click "Add" on desired song
  ↓
Real Spotify data added to queue!
```

---

## 🔄 Backward Compatibility

- ✅ **Old songs still work**: Manually added songs continue to function
- ✅ **Hybrid system**: Mix Spotify and manual songs in same queue
- ✅ **No breaking changes**: All existing features work as before
- ✅ **Graceful fallback**: If Spotify fails, shows helpful error

---

## 🎵 What's Next (Optional Enhancements)

### Phase 2: Preview Playback
Add audio player to play 30-second previews:
```tsx
{song.previewUrl && (
  <audio src={song.previewUrl} controls />
)}
```

### Phase 3: User Authentication
Allow users to:
- Connect their Spotify account
- Import from their playlists
- Save room queue to their Spotify

### Phase 4: Full Playback (Premium Only)
Integrate Spotify Web Playback SDK:
- Full song playback
- Requires Spotify Premium
- Professional music player

---

## 🐛 Troubleshooting

### "Spotify integration not configured"
- Check `.env` file has correct credentials
- Restart backend after updating `.env`
- Verify credentials at Spotify Developer Dashboard

### "Too many requests"
- Spotify has rate limits
- Wait a moment and try again
- Limit searches to avoid hitting limits

### No search results
- Check internet connection
- Verify Spotify credentials are correct
- Try a different search query

### Album art not showing
- Some songs may not have artwork
- Check browser console for image loading errors
- Fallback: No image shown

---

## 📊 Current Status

### ✅ Completed
- [x] Backend Spotify controller
- [x] Search endpoint with token management
- [x] Frontend search modal
- [x] Real-time search results
- [x] Album artwork display
- [x] One-click song addition
- [x] Error handling
- [x] Backward compatibility

### 🎯 Ready to Use
Your Groovly app now has professional Spotify integration! Just add your API credentials and start searching for songs.

---

## 💡 Quick Test

1. Get Spotify credentials (takes 2 minutes)
2. Add to `.env` file
3. Restart backend
4. Search for "Imagine Dragons"
5. See professional results! 🎉

---

**Need help?** Check the [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
