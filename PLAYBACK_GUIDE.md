# 🎵 Groovly Playback Guide

## How to Play Songs

### Step 1: Add Songs to Queue
1. Click the **"+ Add Song"** button
2. Search for songs using Spotify
3. Click on a song to add it to the queue

### Step 2: Start Playing (Host Only)
When songs are in the queue but nothing is playing:
- You'll see a **"▶ Start Playing"** button
- Click it to start playing the first song in the queue

### Step 3: Playback Controls

#### Everyone Can:
- **▶ Play** - Start playback of the current song
- **⏸ Pause** - Pause the current song

#### Host Only:
- **⏭ Skip** - Skip to the next song in queue
  - Automatically plays the next song
  - If queue is empty, playback stops

### Auto-Play Features

1. **Auto-Play Next Song**
   - When a song finishes, the next song automatically starts
   - Only works if there are songs in the queue

2. **Auto-Skip to Next**
   - When host clicks skip, it automatically loads and plays the next song
   - Seamless transition between songs

### Progress Bar
- Shows how much of the 30-second preview has played
- Displays current time and total duration (e.g., "0:15 / 0:30")
- Updates in real-time as the song plays

### Important Notes

⚠️ **Spotify Preview Limitations:**
- Spotify only provides **30-second previews** for free
- Not all songs have preview URLs available
- If a song has no preview, you'll see "⚠️ No preview available"
- Play/Pause buttons will be disabled for songs without previews

🎧 **For Full Song Playback:**
To play full songs, you would need to:
1. Integrate Spotify Web Playback SDK (requires Spotify Premium)
2. Users must have Spotify Premium accounts
3. Users must authorize Groovly with their Spotify account

### Playback Flow

```
1. Add Song → Queue
2. Host clicks "Start Playing" → Song moves to "Now Playing"
3. Everyone can Play/Pause
4. Song ends automatically → Next song starts
5. Host can Skip → Next song starts immediately
6. No more songs → "No song playing" state
```

### Real-Time Sync

All playback actions are synchronized across all members in the room:
- When host starts a song, everyone sees it
- Queue updates in real-time
- Voting updates are instant
- Skip/play/pause are synced

### Troubleshooting

**Song not playing?**
- Check if song has a preview URL
- Try another song from Spotify search
- Make sure you clicked Play button

**"Start Playing" button not showing?**
- Only the host can see this button
- Must have at least one song in the queue
- Must not have a song currently playing

**Audio cuts off at 30 seconds?**
- This is normal - Spotify previews are 30 seconds
- Next song will auto-play if available

**Can't click Play/Pause?**
- Song might not have a preview URL available
- Try adding a different song

### API Endpoint Used

```
POST /api/rooms/:roomId/songs/play-next
```

**What it does:**
- Finds the next song based on room mode:
  - **Democratic mode:** Song with highest votes
  - **DJ/Auto-play mode:** Oldest song (FIFO)
- Marks current song as played
- Sets next song as currently playing
- Emits socket event to all members

**Response:**
```json
{
  "success": true,
  "message": "Playing next song",
  "data": {
    // Updated room object with currentSong populated
  }
}
```

### Socket Events

**Emitted by backend:**
- `song-started` - When a new song starts playing
  - All clients refresh room and queue data

**Listened by frontend:**
- Automatically updates Now Playing section
- Removes played song from queue
- Shows progress bar and controls

---

**Enjoy your collaborative music experience!** 🎶
