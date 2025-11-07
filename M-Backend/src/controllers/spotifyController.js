const SpotifyWebApi = require('spotify-web-api-node');

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Get access token (needed for search)
let tokenExpirationTime = 0;

const getAccessToken = async () => {
  const now = Date.now();
  
  // Check if token is still valid (refresh 5 minutes before expiry)
  if (now < tokenExpirationTime - 300000) {
    return;
  }

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    tokenExpirationTime = now + (data.body.expires_in * 1000);
    console.log('✅ Spotify access token refreshed');
  } catch (error) {
    console.error('❌ Error getting Spotify access token:', error.message);
    throw error;
  }
};

// @desc    Search for songs on Spotify
// @route   GET /api/spotify/search?q=query&limit=10
// @access  Private
exports.searchTracks = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Check if Spotify credentials are configured
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Spotify integration not configured. Please add songs manually.'
      });
    }

    // Ensure we have a valid access token
    await getAccessToken();

    // Search for tracks
    const data = await spotifyApi.searchTracks(q, { limit: parseInt(limit) });

    // Format the results
    const tracks = data.body.tracks.items.map(track => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images.length > 0 ? track.album.images[0].url : null,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
      uri: track.uri,
      explicit: track.explicit,
      popularity: track.popularity
    }));

    res.status(200).json({
      success: true,
      data: tracks,
      count: tracks.length
    });
  } catch (error) {
    console.error('Spotify search error:', error);
    
    // Handle rate limiting
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again in a moment.'
      });
    }
    
    next(error);
  }
};

// @desc    Get track details by Spotify ID
// @route   GET /api/spotify/track/:id
// @access  Private
exports.getTrack = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Spotify track ID is required'
      });
    }

    // Check if Spotify credentials are configured
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Spotify integration not configured'
      });
    }

    // Ensure we have a valid access token
    await getAccessToken();

    // Get track details
    const data = await spotifyApi.getTrack(id);
    const track = data.body;

    const trackData = {
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images.length > 0 ? track.album.images[0].url : null,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
      uri: track.uri,
      explicit: track.explicit,
      popularity: track.popularity
    };

    res.status(200).json({
      success: true,
      data: trackData
    });
  } catch (error) {
    console.error('Spotify get track error:', error);
    
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: 'Track not found on Spotify'
      });
    }
    
    next(error);
  }
};

// @desc    Get recommendations based on a track
// @route   GET /api/spotify/recommendations/:id
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Spotify integration not configured'
      });
    }

    await getAccessToken();

    const data = await spotifyApi.getRecommendations({
      seed_tracks: [id],
      limit: parseInt(limit)
    });

    const tracks = data.body.tracks.map(track => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images.length > 0 ? track.album.images[0].url : null,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
      uri: track.uri,
      explicit: track.explicit
    }));

    res.status(200).json({
      success: true,
      data: tracks,
      count: tracks.length
    });
  } catch (error) {
    console.error('Spotify recommendations error:', error);
    next(error);
  }
};

// No module.exports needed - using exports.functionName pattern
