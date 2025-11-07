// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  activeRoom?: string;
  createdAt: string;
  updatedAt: string;
}

// Room types
export enum RoomMode {
  DEMOCRATIC = 'democratic',
  DJ_MODE = 'dj-mode',
  AUTO_PLAY = 'auto-play',
}

export interface RoomSettings {
  skipThreshold: number;
  maxQueueSize: number;
  maxSongsPerUser: number;
  allowDuplicates: boolean;
  allowExplicit: boolean;
}

export interface RoomMember {
  user: User;
  joinedAt: string;
  role: 'host' | 'member';
}

export interface PlaybackState {
  isPlaying: boolean;
  position: number;
  lastUpdated: string;
}

export interface Room {
  _id: string;
  name: string;
  code: string;
  host: User | string;
  mode: RoomMode;
  settings: RoomSettings;
  members: RoomMember[];
  currentSong?: Song | string | null;
  playbackState: PlaybackState;
  isActive: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

// Song types
export enum SongStatus {
  QUEUED = 'queued',
  PLAYING = 'playing',
  PLAYED = 'played',
  SKIPPED = 'skipped',
}

export interface Song {
  _id: string;
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail?: string;
  durationMs: number;
  addedBy: User | string;
  upvotes: string[];
  downvotes: string[];
  status: SongStatus;
  playedAt?: string;
  room: string;
  voteScore: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

// Socket.io event types
export interface SocketEvents {
  // Client to Server
  'join-room': (data: { roomId: string }) => void;
  'leave-room': (data: { roomId: string }) => void;
  'add-song': (data: { roomId: string; songData: any }) => void;
  'upvote': (data: { songId: string; roomId: string }) => void;
  'downvote': (data: { songId: string; roomId: string }) => void;
  'host-play': (data: { roomId: string; songId: string; position?: number }) => void;
  'host-pause': (data: { roomId: string; position?: number }) => void;
  'host-skip': (data: { roomId: string; songId: string }) => void;
  'host-seek': (data: { roomId: string; position: number }) => void;
  
  // Server to Client
  'queue-updated': (data: { action: string; song?: Song; songId?: string }) => void;
  'song-updated': (data: { song: Song }) => void;
  'song-started': (data: { songId: string }) => void;
  'song-skipped': (data: { songId: string }) => void;
  'member-joined': (data: { user: User }) => void;
  'member-left': (data: { user: User; temporary?: boolean }) => void;
  'playback-state': (data: { isPlaying: boolean; songId?: string; position: number; timestamp: number }) => void;
  'error': (data: { message: string }) => void;
  'room-closed': () => void;
}
