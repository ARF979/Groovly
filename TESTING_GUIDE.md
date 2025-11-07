# 🧪 Groovly - Testing & Verification Guide

## Manual Testing Checklist

### ✅ Phase 1: Authentication Testing

#### Test 1.1: User Registration
- [ ] Navigate to `/auth/register`
- [ ] Fill in valid details:
  - Name: "Test User"
  - Email: "test@example.com"
  - Password: "password123"
  - Confirm Password: "password123"
- [ ] Click "Sign Up"
- [ ] **Expected**: Redirected to `/dashboard`
- [ ] **Expected**: Welcome message shows "Welcome, Test User"

#### Test 1.2: Password Validation
- [ ] Try password < 6 characters
- [ ] **Expected**: Error message shown
- [ ] Try mismatched passwords
- [ ] **Expected**: Error "Passwords do not match"

#### Test 1.3: Duplicate Email
- [ ] Try registering with existing email
- [ ] **Expected**: Error from backend

#### Test 1.4: User Login
- [ ] Logout (if logged in)
- [ ] Navigate to `/auth/login`
- [ ] Enter credentials from Test 1.1
- [ ] Click "Login"
- [ ] **Expected**: Redirected to `/dashboard`

#### Test 1.5: Invalid Login
- [ ] Try wrong password
- [ ] **Expected**: Error message shown
- [ ] Try non-existent email
- [ ] **Expected**: Error message shown

#### Test 1.6: Protected Route
- [ ] Logout
- [ ] Try to access `/dashboard` directly
- [ ] **Expected**: Redirected to `/auth/login`

---

### ✅ Phase 2: Room Management Testing

#### Test 2.1: Create Room - Democratic Mode
- [ ] Login to account
- [ ] Click "Create Room"
- [ ] Enter room name: "Test Party Room"
- [ ] Select mode: "Democratic"
- [ ] Click "Create Room"
- [ ] **Expected**: Redirected to `/room/[id]`
- [ ] **Expected**: Room name displayed in header
- [ ] **Expected**: 6-character room code shown
- [ ] **Expected**: Mode shows "democratic"
- [ ] **Expected**: Member count shows "1 members"

#### Test 2.2: Create Room - DJ Mode
- [ ] Return to dashboard
- [ ] Create room with DJ Mode
- [ ] **Expected**: Queue should not show voting buttons

#### Test 2.3: Create Room - Auto-play Mode
- [ ] Return to dashboard
- [ ] Create room with Auto-play Mode
- [ ] **Expected**: Songs ordered by creation time

#### Test 2.4: Join Room by Code
- [ ] Open second browser/incognito window
- [ ] Create new account ("test2@example.com")
- [ ] Click "Join Room"
- [ ] Enter room code from Test 2.1
- [ ] Click "Join Room"
- [ ] **Expected**: Redirected to same room
- [ ] **Expected**: Member count now shows "2 members"
- [ ] **Both windows**: Should see 2 members in sidebar

#### Test 2.5: Invalid Room Code
- [ ] Try joining with invalid code "XXXXXX"
- [ ] **Expected**: Error message "Room not found"

#### Test 2.6: Leave Room
- [ ] In room, click "Leave Room"
- [ ] **Expected**: Redirected to `/dashboard`
- [ ] **Other window**: Member count decreases

#### Test 2.7: Close Room (Host Only)
- [ ] As host, click "Close Room"
- [ ] Confirm dialog
- [ ] **Expected**: Redirected to `/dashboard`
- [ ] **Other members**: Alert "Room has been closed"
- [ ] **Other members**: Redirected to `/dashboard`

---

### ✅ Phase 3: Song Queue Testing

#### Test 3.1: Add First Song
- [ ] Create new room (democratic mode)
- [ ] Click "Add Song"
- [ ] Fill in:
  - Title: "Mr. Brightside"
  - Artist: "The Killers"
  - Album: "Hot Fuss"
- [ ] Click "Add to Queue"
- [ ] **Expected**: Modal closes
- [ ] **Expected**: Song appears in queue
- [ ] **Expected**: Position shows "#1"

#### Test 3.2: Add Multiple Songs
- [ ] Add 4 more songs
- [ ] **Expected**: All songs appear in queue
- [ ] **Expected**: Positions numbered 1-5

#### Test 3.3: Real-time Queue Updates
- [ ] Have second user (from different account) add a song
- [ ] **Expected**: Song appears in both windows immediately
- [ ] **Expected**: No page refresh needed

#### Test 3.4: Queue Persistence
- [ ] Refresh the page
- [ ] **Expected**: All songs still in queue
- [ ] **Expected**: Order maintained

---

### ✅ Phase 4: Voting System Testing (Democratic Mode)

#### Test 4.1: Upvote Song
- [ ] Click upvote on a song
- [ ] **Expected**: Button highlights green
- [ ] **Expected**: Vote score increases by 1
- [ ] **Expected**: Queue re-sorts if needed

#### Test 4.2: Remove Upvote
- [ ] Click upvote again on same song
- [ ] **Expected**: Upvote removed
- [ ] **Expected**: Button returns to normal
- [ ] **Expected**: Vote score decreases

#### Test 4.3: Downvote Song
- [ ] Click downvote on a song
- [ ] **Expected**: Button highlights red
- [ ] **Expected**: Vote score decreases by 1

#### Test 4.4: Switch Vote
- [ ] Upvote a song
- [ ] Then downvote same song
- [ ] **Expected**: Upvote removed, downvote added
- [ ] **Expected**: Score changes by 2 (from +1 to -1)

#### Test 4.5: Multi-user Voting
- [ ] User 1: Upvote song A
- [ ] User 2: Upvote song A
- [ ] **Expected**: Score = +2
- [ ] **Both windows**: Queue re-sorts
- [ ] **Expected**: Song with most votes moves to top

#### Test 4.6: Real-time Vote Sync
- [ ] User 1: Upvotes song
- [ ] **User 2's window**: Score updates immediately
- [ ] No refresh needed

---

### ✅ Phase 5: Host Controls Testing

#### Test 5.1: Play Song (Host Only)
- [ ] As host, verify "Play" button visible in Now Playing
- [ ] Click "Play"
- [ ] **Expected**: Button changes to "Pause"
- [ ] **All members**: See playback state update

#### Test 5.2: Pause Song (Host Only)
- [ ] Click "Pause"
- [ ] **Expected**: Button changes to "Play"
- [ ] **All members**: Playback paused

#### Test 5.3: Skip Song (Host Only)
- [ ] Click "Skip"
- [ ] **Expected**: Next song in queue starts
- [ ] **Expected**: Skipped song removed from queue

#### Test 5.4: Host Controls Hidden for Members
- [ ] As non-host user
- [ ] **Expected**: No Play/Pause/Skip buttons visible
- [ ] **Expected**: Can only see current song info

---

### ✅ Phase 6: Members List Testing

#### Test 6.1: Members Display
- [ ] Check members sidebar
- [ ] **Expected**: All members listed
- [ ] **Expected**: Host has "Host" badge
- [ ] **Expected**: Members show name initial avatar

#### Test 6.2: Real-time Member Join
- [ ] Have new user join room
- [ ] **Expected**: New member appears in list immediately
- [ ] **Expected**: Member count increases

#### Test 6.3: Real-time Member Leave
- [ ] Have member leave room
- [ ] **Expected**: Member removed from list
- [ ] **Expected**: Member count decreases

#### Test 6.4: Member Disconnect/Reconnect
- [ ] Close browser tab (member)
- [ ] Reopen and rejoin
- [ ] **Expected**: Member count adjusts correctly

---

### ✅ Phase 7: Socket.io Real-time Testing

#### Test 7.1: Connection Status
- [ ] Open browser DevTools → Console
- [ ] **Expected**: See "Socket connected: [id]"
- [ ] No connection errors

#### Test 7.2: Queue Update Events
- [ ] Add song in window 1
- [ ] **Window 2**: Check console
- [ ] **Expected**: "Queue updated" log
- [ ] **Expected**: UI updates

#### Test 7.3: Vote Update Events
- [ ] Vote in window 1
- [ ] **Window 2**: Check console
- [ ] **Expected**: "Song updated" log
- [ ] **Expected**: Vote score updates

#### Test 7.4: Playback Sync
- [ ] Host plays song in window 1
- [ ] **All windows**: Should sync playback state
- [ ] **Expected**: All show "playing" state

#### Test 7.5: Disconnect Handling
- [ ] Disconnect internet
- [ ] Reconnect
- [ ] **Expected**: Socket reconnects automatically
- [ ] **Expected**: Room state reloads

---

### ✅ Phase 8: Error Handling Testing

#### Test 8.1: Network Errors
- [ ] Disconnect backend
- [ ] Try to add song
- [ ] **Expected**: Error message shown
- [ ] **Expected**: UI doesn't break

#### Test 8.2: Invalid Data
- [ ] Try empty song title
- [ ] **Expected**: Form validation prevents submit
- [ ] Try empty room name
- [ ] **Expected**: Validation error

#### Test 8.3: Unauthorized Actions
- [ ] As member, try to access host-only features
- [ ] **Expected**: Features hidden or disabled
- [ ] If accessed via API: Error returned

#### Test 8.4: Session Expiry
- [ ] Wait for JWT to expire (or manually delete token)
- [ ] Try to make API call
- [ ] **Expected**: Redirected to login

---

### ✅ Phase 9: UI/UX Testing

#### Test 9.1: Responsive Design - Mobile
- [ ] Open DevTools → Mobile view (375px)
- [ ] Test all pages
- [ ] **Expected**: All elements visible and usable
- [ ] **Expected**: No horizontal scroll
- [ ] **Expected**: Modals fit screen

#### Test 9.2: Responsive Design - Tablet
- [ ] Resize to 768px
- [ ] **Expected**: Layout adjusts gracefully

#### Test 9.3: Responsive Design - Desktop
- [ ] Full screen (1920px)
- [ ] **Expected**: Content centered with max-width

#### Test 9.4: Loading States
- [ ] Check loading indicators appear during:
  - Login
  - Create room
  - Join room
  - Add song

#### Test 9.5: Hover Effects
- [ ] Hover over buttons
- [ ] **Expected**: Smooth transitions
- [ ] **Expected**: Color changes

#### Test 9.6: Form Validation Messages
- [ ] Submit forms with invalid data
- [ ] **Expected**: Clear error messages
- [ ] **Expected**: Fields highlighted

---

### ✅ Phase 10: Performance Testing

#### Test 10.1: Large Queue
- [ ] Add 20+ songs to queue
- [ ] **Expected**: Scrollable list
- [ ] **Expected**: No lag in UI
- [ ] **Expected**: Voting still responsive

#### Test 10.2: Multiple Users (5+)
- [ ] Have 5+ users in same room
- [ ] **Expected**: All members listed
- [ ] **Expected**: Real-time updates still fast

#### Test 10.3: Rapid Actions
- [ ] Quickly upvote/downvote multiple songs
- [ ] **Expected**: All votes register
- [ ] **Expected**: No race conditions

#### Test 10.4: Long Room Session
- [ ] Stay in room for 10+ minutes
- [ ] **Expected**: No memory leaks
- [ ] **Expected**: Socket stays connected

---

## API Testing with cURL

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login (save token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Create room (replace TOKEN)
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Room",
    "mode": "democratic"
  }'

# Get room (replace TOKEN and ID)
curl -X GET http://localhost:5000/api/rooms/ROOM_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Browser DevTools Checklist

### Console Tab
- [ ] No errors on page load
- [ ] Socket connection logs present
- [ ] Event logs visible (queue-updated, etc.)

### Network Tab
- [ ] API calls return 200 status
- [ ] WebSocket connection established
- [ ] No 401/403 errors

### Application Tab
- [ ] localStorage contains `groovly_token`
- [ ] Token is valid JWT format

---

## Cross-Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Common Issues & Solutions

### Issue: Socket not connecting
**Solution**: 
- Check backend is running
- Verify token in localStorage
- Check CORS settings
- Clear cache and reload

### Issue: Real-time updates not working
**Solution**:
- Check Socket.io connection in console
- Verify room ID is correct
- Check event listeners attached
- Try refreshing page

### Issue: Votes not updating
**Solution**:
- Check democratic mode is enabled
- Verify API call succeeds (Network tab)
- Check Socket event received
- Try re-joining room

### Issue: Can't join room
**Solution**:
- Verify room code is correct (6 chars)
- Check room exists and is active
- Ensure user is authenticated
- Try creating new room instead

---

## Automated Testing (Future)

### Unit Tests (Frontend)
```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Tests (Playwright)
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

---

## Test Data Cleanup

After testing, you may want to clean up:

```bash
# Connect to MongoDB
mongosh

# Use database
use groovly

# Delete test data
db.users.deleteMany({ email: /test/ })
db.rooms.deleteMany({ name: /Test/ })
db.songs.deleteMany({})
```

---

## Test Scenarios Summary

| Scenario | Test Count | Status |
|----------|-----------|--------|
| Authentication | 6 | ✅ Ready |
| Room Management | 7 | ✅ Ready |
| Song Queue | 4 | ✅ Ready |
| Voting System | 6 | ✅ Ready |
| Host Controls | 4 | ✅ Ready |
| Members List | 4 | ✅ Ready |
| Socket.io | 5 | ✅ Ready |
| Error Handling | 4 | ✅ Ready |
| UI/UX | 6 | ✅ Ready |
| Performance | 4 | ✅ Ready |
| **Total** | **50** | **✅ All Ready** |

---

## Success Criteria

Your Groovly app is working correctly if:

✅ Users can register and login  
✅ Users can create and join rooms  
✅ Songs can be added to queue  
✅ Voting changes queue order (democratic mode)  
✅ Host can control playback  
✅ Real-time updates work across multiple clients  
✅ UI is responsive and error-free  
✅ Socket.io connection is stable  
✅ All CRUD operations work  
✅ No console errors

---

**Happy Testing! 🧪✨**
