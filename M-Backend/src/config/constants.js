module.exports = {
  // Room modes
  ROOM_MODES: {
    DEMOCRATIC: 'democratic', // Voting determines order
    DJ_MODE: 'dj-mode',       // Host controls everything
    AUTO_PLAY: 'auto-play'    // Queue plays automatically
  },

  // Song status
  SONG_STATUS: {
    QUEUED: 'queued',
    PLAYING: 'playing',
    PLAYED: 'played',
    SKIPPED: 'skipped'
  },

  // User roles in room
  USER_ROLES: {
    HOST: 'host',
    MEMBER: 'member'
  },

  // Socket events
  SOCKET_EVENTS: {
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
    ROOM_CLOSED: 'room-closed'
  },

  // Default room settings
  DEFAULT_ROOM_SETTINGS: {
    skipThreshold: parseInt(process.env.SKIP_THRESHOLD_PERCENTAGE) || 50,
    maxQueueSize: 100,
    maxSongsPerUser: 5,
    allowDuplicates: false,
    allowExplicit: true
  },

  // Validation
  ROOM_CODE_LENGTH: parseInt(process.env.ROOM_CODE_LENGTH) || 6,
  MAX_ROOM_NAME_LENGTH: 50,
  MAX_SONG_TITLE_LENGTH: 200,
  MAX_MEMBERS: 50
};
