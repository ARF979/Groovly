const SpotifyWebApi = require("spotify-web-api-node");

class SpotifyService {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });

    this.tokenExpirationTime = null;
  }

  /**
   * Authenticate with Spotify using Client Credentials flow
   */
  async authenticate() {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.spotifyApi.setAccessToken(data.body["access_token"]);
      this.tokenExpirationTime = Date.now() + data.body["expires_in"] * 1000;
      console.log("Spotify API authenticated successfully");
      return true;
    } catch (error) {
      console.error("Error authenticating with Spotify:", error);
      throw new Error("Failed to authenticate with Spotify");
    }
  }

  /**
   * Check if token needs refresh
   */
  async ensureValidToken() {
    if (
      !this.tokenExpirationTime ||
      Date.now() >= this.tokenExpirationTime - 60000
    ) {
      await this.authenticate();
    }
  }

  /**
   * Fetch tracks from a Spotify playlist
   * @param {string} playlistId - Spotify playlist ID
   * @param {number} count - Number of songs to fetch
   * @returns {Array} Array of track objects
   */
  async getPlaylistTracks(playlistId, count = 10) {
    await this.ensureValidToken();

    try {
      const response = await this.spotifyApi.getPlaylistTracks(playlistId, {
        limit: 100,
        fields: "items(track(id,name,artists,album,preview_url,duration_ms))",
      });

      // Filter tracks that have preview URLs
      const tracksWithPreview = response.body.items
        .filter((item) => item.track && item.track.preview_url)
        .map((item) => ({
          spotifyId: item.track.id,
          title: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          previewUrl: item.track.preview_url,
          albumArtUrl: item.track.album.images[0]?.url || null,
          duration: item.track.duration_ms,
        }));

      if (tracksWithPreview.length < count) {
        throw new Error(
          `Playlist has only ${tracksWithPreview.length} tracks with preview URLs. Need at least ${count}.`
        );
      }

      // Shuffle and return requested count
      return this.shuffleArray(tracksWithPreview).slice(0, count);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      throw new Error("Failed to fetch tracks from playlist");
    }
  }

  /**
   * Get wrong answer options for multiple choice
   * @param {string} correctAnswer - The correct song title
   * @param {string} playlistId - Playlist ID to get wrong answers from
   * @returns {Array} Array of 3 wrong answer strings
   */
  async getWrongAnswerOptions(correctAnswer, playlistId) {
    await this.ensureValidToken();

    try {
      const response = await this.spotifyApi.getPlaylistTracks(playlistId, {
        limit: 50,
        fields: "items(track(name))",
      });

      const allTracks = response.body.items
        .filter((item) => item.track && item.track.name !== correctAnswer)
        .map((item) => item.track.name);

      // Shuffle and take 3 wrong answers
      const shuffled = this.shuffleArray(allTracks);
      return shuffled.slice(0, 3);
    } catch (error) {
      console.error("Error fetching wrong answer options:", error);
      // Fallback to generic wrong answers
      return ["Bohemian Rhapsody", "Stairway to Heaven", "Hotel California"];
    }
  }

  /**
   * Search for playlists by query
   * @param {string} query - Search query
   * @param {number} limit - Number of results
   * @returns {Array} Array of playlist objects
   */
  async searchPlaylists(query, limit = 10) {
    await this.ensureValidToken();

    try {
      const response = await this.spotifyApi.searchPlaylists(query, { limit });
      return response.body.playlists.items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        trackCount: playlist.tracks.total,
        imageUrl: playlist.images[0]?.url || null,
        owner: playlist.owner.display_name,
      }));
    } catch (error) {
      console.error("Error searching playlists:", error);
      throw new Error("Failed to search playlists");
    }
  }

  /**
   * Get playlist details
   * @param {string} playlistId - Spotify playlist ID
   * @returns {Object} Playlist details
   */
  async getPlaylistDetails(playlistId) {
    await this.ensureValidToken();

    try {
      const response = await this.spotifyApi.getPlaylist(playlistId);
      return {
        id: response.body.id,
        name: response.body.name,
        description: response.body.description,
        trackCount: response.body.tracks.total,
        imageUrl: response.body.images[0]?.url || null,
        owner: response.body.owner.display_name,
      };
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      throw new Error("Failed to fetch playlist details");
    }
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Validate playlist ID format
   * @param {string} playlistId - Playlist ID to validate
   * @returns {boolean} Whether the ID is valid
   */
  isValidPlaylistId(playlistId) {
    return /^[a-zA-Z0-9]{22}$/.test(playlistId);
  }
}

module.exports = new SpotifyService();
