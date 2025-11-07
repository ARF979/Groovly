'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api, { handleApiError } from '@/lib/api';
import socketService from '@/lib/socket';
import { API_ENDPOINTS, SOCKET_EVENTS } from '@/config/constants';
import { Room, Song, User } from '@/types';

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);

  // Check if current user is host
  const isHost = room && user && (typeof room.host === 'string' ? room.host === user._id : room.host._id === user._id);

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    try {
      const response = await api.get<{ success: boolean; data: Room }>(
        API_ENDPOINTS.GET_ROOM(roomId)
      );
      setRoom(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  }, [roomId]);

  // Fetch queue
  const fetchQueue = useCallback(async () => {
    try {
      const response = await api.get<{ success: boolean; data: Song[] }>(
        API_ENDPOINTS.GET_ROOM_QUEUE(roomId)
      );
      setQueue(response.data.data);
    } catch (err) {
      console.error('Error fetching queue:', err);
    }
  }, [roomId]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await loadUser();
      await fetchRoom();
      await fetchQueue();
      setIsLoading(false);
    };
    init();
  }, [loadUser, fetchRoom, fetchQueue]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Socket.io setup
  useEffect(() => {
    if (!isAuthenticated || !roomId) return;

    const socket = socketService.connect();
    if (!socket) return;

    // Join room
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId });

    // Listen for queue updates
    socket.on(SOCKET_EVENTS.QUEUE_UPDATED, (data) => {
      console.log('Queue updated:', data);
      fetchQueue();
    });

    // Listen for song updates
    socket.on(SOCKET_EVENTS.SONG_UPDATED, (data) => {
      console.log('Song updated:', data);
      setQueue(prev => prev.map(song => 
        song._id === data.song._id ? data.song : song
      ));
    });

    // Listen for playback state
    socket.on(SOCKET_EVENTS.PLAYBACK_STATE, (data) => {
      console.log('Playback state:', data);
      setRoom(prev => prev ? {
        ...prev,
        playbackState: {
          ...prev.playbackState,
          isPlaying: data.isPlaying,
          position: data.position,
          lastUpdated: new Date().toISOString(),
        }
      } : null);
    });

    // Listen for member updates
    socket.on(SOCKET_EVENTS.MEMBER_JOINED, (data) => {
      console.log('Member joined:', data);
      fetchRoom();
    });

    socket.on(SOCKET_EVENTS.MEMBER_LEFT, (data) => {
      console.log('Member left:', data);
      fetchRoom();
    });

    // Listen for errors
    socket.on(SOCKET_EVENTS.ERROR, (data) => {
      console.error('Socket error:', data);
      setError(data.message);
    });

    // Listen for room closed
    socket.on(SOCKET_EVENTS.ROOM_CLOSED, () => {
      alert('Room has been closed by the host');
      router.push('/dashboard');
    });

    // Cleanup
    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId });
      socket.off(SOCKET_EVENTS.QUEUE_UPDATED);
      socket.off(SOCKET_EVENTS.SONG_UPDATED);
      socket.off(SOCKET_EVENTS.PLAYBACK_STATE);
      socket.off(SOCKET_EVENTS.MEMBER_JOINED);
      socket.off(SOCKET_EVENTS.MEMBER_LEFT);
      socket.off(SOCKET_EVENTS.ERROR);
      socket.off(SOCKET_EVENTS.ROOM_CLOSED);
    };
  }, [isAuthenticated, roomId, router, fetchQueue, fetchRoom]);

  // Handle leave room
  const handleLeaveRoom = async () => {
    try {
      await api.post(API_ENDPOINTS.LEAVE_ROOM(roomId));
      router.push('/dashboard');
    } catch (err) {
      console.error('Error leaving room:', err);
    }
  };

  // Handle close room (host only)
  const handleCloseRoom = async () => {
    if (!confirm('Are you sure you want to close this room?')) return;
    
    try {
      await api.delete(API_ENDPOINTS.CLOSE_ROOM(roomId));
      router.push('/dashboard');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading room...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Room not found</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(139,92,246,0.12),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(236,72,153,0.08),_transparent_60%)]" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{room.name}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-muted">Code: <span className="font-mono text-purple-400">{room.code}</span></span>
                  <span className="text-sm text-muted">•</span>
                  <span className="text-sm text-muted capitalize">{room.mode.replace('-', ' ')}</span>
                  <span className="text-sm text-muted">•</span>
                  <span className="text-sm text-muted">{room.members.length} members</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isHost && (
                  <button
                    onClick={handleCloseRoom}
                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition"
                  >
                    Close Room
                  </button>
                )}
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div className="mx-auto max-w-7xl px-6 mt-4">
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Queue Section - Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Now Playing */}
              <NowPlaying room={room} isHost={isHost} />

              {/* Add Song Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Queue</h2>
                <button
                  onClick={() => setShowAddSong(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition"
                >
                  + Add Song
                </button>
              </div>

              {/* Queue List */}
              <QueueList queue={queue} roomId={roomId} room={room} currentUserId={user?._id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Room Members */}
              <MembersList members={room.members} hostId={typeof room.host === 'string' ? room.host : room.host._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Song Modal */}
      {showAddSong && (
        <AddSongModal roomId={roomId} onClose={() => setShowAddSong(false)} />
      )}
    </main>
  );
}

// Now Playing Component
function NowPlaying({ room, isHost }: { room: Room; isHost: boolean }) {
  const currentSong = room.currentSong as Song | null;

  const handlePlay = () => {
    if (currentSong) {
      socketService.emit(SOCKET_EVENTS.HOST_PLAY, {
        roomId: room._id,
        songId: currentSong._id,
      });
    }
  };

  const handlePause = () => {
    socketService.emit(SOCKET_EVENTS.HOST_PAUSE, {
      roomId: room._id,
      position: room.playbackState.position,
    });
  };

  const handleSkip = () => {
    if (currentSong) {
      socketService.emit(SOCKET_EVENTS.HOST_SKIP, {
        roomId: room._id,
        songId: currentSong._id,
      });
    }
  };

  if (!currentSong) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-xl p-8 text-center">
        <div className="text-muted mb-2">No song playing</div>
        <div className="text-white/60 text-sm">Add a song to get started!</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-xl p-6">
      <div className="text-sm text-muted mb-3">Now Playing</div>
      <div className="flex gap-6">
        {currentSong.albumArt && (
          <img
            src={currentSong.albumArt}
            alt={currentSong.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h3>
          <p className="text-lg text-muted mb-4">{currentSong.artist}</p>
          
          {isHost && (
            <div className="flex gap-3">
              {room.playbackState.isPlaying ? (
                <button
                  onClick={handlePause}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  Play
                </button>
              )}
              <button
                onClick={handleSkip}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Queue List Component
function QueueList({ queue, roomId, room, currentUserId }: { queue: Song[]; roomId: string; room: Room; currentUserId?: string }) {
  // Sort queue based on room mode
  const sortedQueue = [...queue].sort((a, b) => {
    if (room.mode === 'democratic') {
      return b.voteScore - a.voteScore;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const handleVote = async (songId: string, type: 'upvote' | 'downvote') => {
    try {
      const endpoint = type === 'upvote' 
        ? API_ENDPOINTS.UPVOTE_SONG(roomId, songId)
        : API_ENDPOINTS.DOWNVOTE_SONG(roomId, songId);
      await api.post(endpoint);
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleRemove = async (songId: string) => {
    if (!confirm('Remove this song from the queue?')) return;
    
    try {
      await api.delete(API_ENDPOINTS.REMOVE_SONG(roomId, songId));
    } catch (err) {
      console.error('Error removing song:', err);
    }
  };

  if (sortedQueue.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-xl p-12 text-center">
        <div className="text-muted">No songs in queue</div>
        <div className="text-white/60 text-sm mt-2">Be the first to add a song!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedQueue.map((song, index) => {
        const hasUpvoted = currentUserId && song.upvotes.includes(currentUserId);
        const hasDownvoted = currentUserId && song.downvotes.includes(currentUserId);
        const isAddedByUser = currentUserId && (typeof song.addedBy === 'string' ? song.addedBy === currentUserId : song.addedBy._id === currentUserId);

        return (
          <div
            key={song._id}
            className="rounded-xl border border-white/10 bg-surface/40 backdrop-blur-xl p-4 hover:border-white/20 transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-muted font-mono text-sm w-8">
                #{index + 1}
              </div>
              
              {song.albumArt && (
                <img
                  src={song.albumArt}
                  alt={song.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{song.title}</h4>
                <p className="text-sm text-muted truncate">{song.artist}</p>
              </div>

              {room.mode === 'democratic' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(song._id, 'upvote')}
                    className={`p-2 rounded-lg transition ${
                      hasUpvoted 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-white font-medium w-8 text-center">
                    {song.voteScore}
                  </span>
                  <button
                    onClick={() => handleVote(song._id, 'downvote')}
                    className={`p-2 rounded-lg transition ${
                      hasDownvoted 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}

              {isAddedByUser && (
                <button
                  onClick={() => handleRemove(song._id)}
                  className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Members List Component
function MembersList({ members, hostId }: { members: Room['members']; hostId: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Members ({members.length})</h3>
      <div className="space-y-3">
        {members.map((member) => {
          const user = member.user as User;
          const isHost = user._id === hostId;
          
          return (
            <div key={user._id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{user.name}</div>
                {isHost && (
                  <div className="text-xs text-purple-400">Host</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Add Song Modal Component
function AddSongModal({ roomId, onClose }: { roomId: string; onClose: () => void }) {
  const [songData, setSongData] = useState({
    spotifyId: '',
    title: '',
    artist: '',
    album: '',
    durationMs: 180000,
    albumArt: '',
    previewUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post(API_ENDPOINTS.ADD_SONG(roomId), songData);
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Add Song to Queue</h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">
            Note: Spotify integration coming soon. For now, manually enter song details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Song Title *
            </label>
            <input
              type="text"
              value={songData.title}
              onChange={(e) => setSongData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mr. Brightside"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Artist *
            </label>
            <input
              type="text"
              value={songData.artist}
              onChange={(e) => setSongData(prev => ({ ...prev, artist: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="The Killers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Album
            </label>
            <input
              type="text"
              value={songData.album}
              onChange={(e) => setSongData(prev => ({ ...prev, album: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Hot Fuss"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Spotify ID (or any unique ID)
            </label>
            <input
              type="text"
              value={songData.spotifyId}
              onChange={(e) => setSongData(prev => ({ ...prev, spotifyId: e.target.value || `manual-${Date.now()}` }))}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Leave blank for auto-generated ID"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add to Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
