export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  GET_ME: '/api/auth/me',
  UPDATE_PROFILE: '/api/auth/profile',
  
  // Rooms
  CREATE_ROOM: '/api/rooms',
  GET_ROOM: (identifier: string) => `/api/rooms/${identifier}`,
  JOIN_ROOM: (code: string) => `/api/rooms/${code}/join`,
  LEAVE_ROOM: (id: string) => `/api/rooms/${id}/leave`,
  CLOSE_ROOM: (id: string) => `/api/rooms/${id}`,
  UPDATE_ROOM_SETTINGS: (id: string) => `/api/rooms/${id}/settings`,
  GET_ROOM_QUEUE: (id: string) => `/api/rooms/${id}/queue`,
  GET_ROOM_HISTORY: (id: string) => `/api/rooms/${id}/history`,
  
  // Songs
  ADD_SONG: (roomId: string) => `/api/rooms/${roomId}/songs`,
  UPVOTE_SONG: (roomId: string, songId: string) => `/api/rooms/${roomId}/songs/${songId}/upvote`,
  DOWNVOTE_SONG: (roomId: string, songId: string) => `/api/rooms/${roomId}/songs/${songId}/downvote`,
  SKIP_SONG: (roomId: string, songId: string) => `/api/rooms/${roomId}/songs/${songId}/skip`,
  REMOVE_SONG: (roomId: string, songId: string) => `/api/rooms/${roomId}/songs/${songId}`,
};

export const SOCKET_EVENTS = {
  // Client to Server
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ADD_SONG: 'add-song',
  UPVOTE: 'upvote',
  DOWNVOTE: 'downvote',
  HOST_PLAY: 'host-play',
  HOST_PAUSE: 'host-pause',
  HOST_SKIP: 'host-skip',
  HOST_SEEK: 'host-seek',
  
  // Server to Client
  QUEUE_UPDATED: 'queue-updated',
  SONG_UPDATED: 'song-updated',
  SONG_STARTED: 'song-started',
  SONG_SKIPPED: 'song-skipped',
  MEMBER_JOINED: 'member-joined',
  MEMBER_LEFT: 'member-left',
  PLAYBACK_STATE: 'playback-state',
  ERROR: 'error',
  ROOM_CLOSED: 'room-closed',
};

export const ROOM_MODES = {
  DEMOCRATIC: 'democratic',
  DJ_MODE: 'dj-mode',
  AUTO_PLAY: 'auto-play',
};

export const DEFAULT_ROOM_SETTINGS = {
  skipThreshold: 50,
  maxQueueSize: 100,
  maxSongsPerUser: 5,
  allowDuplicates: false,
  allowExplicit: true,
};

export const TOKEN_KEY = 'groovly_token';
