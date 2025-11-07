const Room = require('../models/Room');
const Song = require('../models/Song');
const User = require('../models/User');
const { SOCKET_EVENTS, SONG_STATUS } = require('../config/constants');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    // Join room
    socket.on(SOCKET_EVENTS.JOIN_ROOM, async (data) => {
      try {
        const { roomId } = data;
        const room = await Room.findById(roomId)
          .populate('members.user', 'name avatarUrl')
          .populate('currentSong');

        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }

        // Check if user is a member
        const isMember = room.members.some(
          m => m.user._id.toString() === socket.user._id.toString()
        );

        if (!isMember) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not a member of this room' });
          return;
        }

        // Join socket room
        socket.join(roomId);
        socket.currentRoom = roomId;

        // Notify others
        socket.to(roomId).emit(SOCKET_EVENTS.MEMBER_JOINED, {
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            avatarUrl: socket.user.avatarUrl
          }
        });

        console.log(`${socket.user.name} joined room ${room.code}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, async (data) => {
      try {
        const { roomId } = data;

        if (socket.currentRoom === roomId) {
          socket.leave(roomId);
          socket.to(roomId).emit(SOCKET_EVENTS.MEMBER_LEFT, {
            user: {
              _id: socket.user._id,
              name: socket.user.name
            }
          });
          socket.currentRoom = null;
          console.log(`${socket.user.name} left room`);
        }
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    // Add song
    socket.on(SOCKET_EVENTS.ADD_SONG, async (data) => {
      try {
        const { roomId, songData } = data;
        const room = await Room.findById(roomId);

        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }

        const song = await Song.create({
          ...songData,
          addedBy: socket.user._id,
          room: roomId
        });

        const populatedSong = await Song.findById(song._id)
          .populate('addedBy', 'name avatarUrl');

        // Broadcast to all in room
        io.to(roomId).emit(SOCKET_EVENTS.QUEUE_UPDATED, {
          action: 'added',
          song: populatedSong
        });
      } catch (error) {
        console.error('Error adding song:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to add song' });
      }
    });

    // Upvote
    socket.on(SOCKET_EVENTS.UPVOTE, async (data) => {
      try {
        const { songId, roomId } = data;
        const song = await Song.findById(songId);

        if (!song) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Song not found' });
          return;
        }

        const userId = socket.user._id;
        const hasUpvoted = song.upvotes.some(id => id.toString() === userId.toString());
        const hasDownvoted = song.downvotes.some(id => id.toString() === userId.toString());

        if (hasUpvoted) {
          song.upvotes = song.upvotes.filter(id => id.toString() !== userId.toString());
        } else {
          if (hasDownvoted) {
            song.downvotes = song.downvotes.filter(id => id.toString() !== userId.toString());
          }
          song.upvotes.push(userId);
        }

        await song.save();

        const populatedSong = await Song.findById(song._id)
          .populate('addedBy', 'name avatarUrl');

        io.to(roomId).emit(SOCKET_EVENTS.SONG_UPDATED, {
          song: populatedSong
        });
      } catch (error) {
        console.error('Error upvoting:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to upvote' });
      }
    });

    // Downvote
    socket.on(SOCKET_EVENTS.DOWNVOTE, async (data) => {
      try {
        const { songId, roomId } = data;
        const song = await Song.findById(songId);

        if (!song) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Song not found' });
          return;
        }

        const userId = socket.user._id;
        const hasUpvoted = song.upvotes.some(id => id.toString() === userId.toString());
        const hasDownvoted = song.downvotes.some(id => id.toString() === userId.toString());

        if (hasDownvoted) {
          song.downvotes = song.downvotes.filter(id => id.toString() !== userId.toString());
        } else {
          if (hasUpvoted) {
            song.upvotes = song.upvotes.filter(id => id.toString() !== userId.toString());
          }
          song.downvotes.push(userId);
        }

        await song.save();

        const populatedSong = await Song.findById(song._id)
          .populate('addedBy', 'name avatarUrl');

        io.to(roomId).emit(SOCKET_EVENTS.SONG_UPDATED, {
          song: populatedSong
        });
      } catch (error) {
        console.error('Error downvoting:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to downvote' });
      }
    });

    // Host play
    socket.on(SOCKET_EVENTS.HOST_PLAY, async (data) => {
      try {
        const { roomId, songId, position } = data;
        const room = await Room.findById(roomId);

        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }

        if (!room.isHost(socket.user._id)) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only host can control playback' });
          return;
        }

        room.currentSong = songId;
        room.playbackState.isPlaying = true;
        room.playbackState.position = position || 0;
        room.playbackState.lastUpdated = new Date();
        await room.save();

        // Update song status
        if (songId) {
          await Song.findByIdAndUpdate(songId, {
            status: SONG_STATUS.PLAYING,
            playedAt: new Date()
          });
        }

        io.to(roomId).emit(SOCKET_EVENTS.PLAYBACK_STATE, {
          isPlaying: true,
          songId,
          position: position || 0,
          timestamp: Date.now()
        });

        io.to(roomId).emit(SOCKET_EVENTS.SONG_STARTED, { songId });
      } catch (error) {
        console.error('Error playing song:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to play song' });
      }
    });

    // Host pause
    socket.on(SOCKET_EVENTS.HOST_PAUSE, async (data) => {
      try {
        const { roomId, position } = data;
        const room = await Room.findById(roomId);

        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }

        if (!room.isHost(socket.user._id)) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only host can control playback' });
          return;
        }

        room.playbackState.isPlaying = false;
        room.playbackState.position = position || 0;
        room.playbackState.lastUpdated = new Date();
        await room.save();

        io.to(roomId).emit(SOCKET_EVENTS.PLAYBACK_STATE, {
          isPlaying: false,
          position: position || 0,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error pausing song:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to pause song' });
      }
    });

    // Host skip
    socket.on(SOCKET_EVENTS.HOST_SKIP, async (data) => {
      try {
        const { roomId, songId } = data;
        const room = await Room.findById(roomId);

        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }

        if (!room.isHost(socket.user._id)) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only host can skip songs' });
          return;
        }

        // Mark song as skipped
        await Song.findByIdAndUpdate(songId, {
          status: SONG_STATUS.SKIPPED,
          playedAt: new Date()
        });

        room.currentSong = null;
        room.playbackState.isPlaying = false;
        await room.save();

        io.to(roomId).emit(SOCKET_EVENTS.SONG_SKIPPED, { songId });
        io.to(roomId).emit(SOCKET_EVENTS.QUEUE_UPDATED, { action: 'skipped', songId });
      } catch (error) {
        console.error('Error skipping song:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to skip song' });
      }
    });

    // Host seek
    socket.on(SOCKET_EVENTS.HOST_SEEK, async (data) => {
      try {
        const { roomId, position } = data;
        const room = await Room.findById(roomId);

        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }

        if (!room.isHost(socket.user._id)) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only host can seek' });
          return;
        }

        room.playbackState.position = position;
        room.playbackState.lastUpdated = new Date();
        await room.save();

        socket.to(roomId).emit(SOCKET_EVENTS.PLAYBACK_STATE, {
          isPlaying: room.playbackState.isPlaying,
          position,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error seeking:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to seek' });
      }
    });

    // Member play command (relayed to host)
    socket.on('member-play', async (data) => {
      try {
        const { roomId } = data;
        // Relay to host - host's client will handle the actual playback
        socket.to(roomId).emit('host-play-command', {
          from: socket.user.name
        });
      } catch (error) {
        console.error('Error relaying play command:', error);
      }
    });

    // Member pause command (relayed to host)
    socket.on('member-pause', async (data) => {
      try {
        const { roomId } = data;
        // Relay to host - host's client will handle the actual playback
        socket.to(roomId).emit('host-pause-command', {
          from: socket.user.name
        });
      } catch (error) {
        console.error('Error relaying pause command:', error);
      }
    });

    // Playback update broadcast (from host to members)
    socket.on('playback-update', async (data) => {
      try {
        const { roomId, duration, currentTime, isPlaying } = data;
        // Broadcast to all other clients in the room
        socket.to(roomId).emit('playback-update', {
          duration,
          currentTime,
          isPlaying
        });
      } catch (error) {
        console.error('Error broadcasting playback update:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);
      
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit(SOCKET_EVENTS.MEMBER_LEFT, {
          user: {
            _id: socket.user._id,
            name: socket.user.name
          },
          temporary: true // They might reconnect
        });
      }
    });
  });
};

module.exports = setupSocketHandlers;
