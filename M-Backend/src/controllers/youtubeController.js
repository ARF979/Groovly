const axios = require('axios');

// @desc    Search YouTube Music
// @route   GET /api/youtube/search
// @access  Private
exports.searchSongs = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Use YouTube Data API v3
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${q} music`,
        type: 'video',
        videoCategoryId: '10', // Music category
        maxResults: parseInt(limit),
        key: process.env.YOUTUBE_API_KEY
      }
    });

    // Get video details to fetch duration
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails,snippet',
        id: videoIds,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    // Format results
    const songs = detailsResponse.data.items.map(video => {
      // Parse ISO 8601 duration (e.g., PT3M45S) to milliseconds
      const duration = parseISO8601Duration(video.contentDetails.duration);
      
      // Try to extract artist from title (usually "Artist - Song Title" or "Song Title - Artist")
      const title = video.snippet.title;
      let artist = video.snippet.channelTitle;
      let songTitle = title;

      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        if (parts.length === 2) {
          songTitle = parts[1].trim();
          artist = parts[0].trim();
        }
      }

      return {
        youtubeId: video.id, // video.id is already a string from videos endpoint
        title: songTitle,
        artist: artist,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        durationMs: duration,
        fullTitle: title, // Keep original title for reference
      };
    });

    res.status(200).json({
      success: true,
      data: songs
    });
  } catch (error) {
    console.error('YouTube search error:', error.response?.data || error.message);
    next(error);
  }
};

// Helper function to parse ISO 8601 duration to milliseconds
function parseISO8601Duration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}
