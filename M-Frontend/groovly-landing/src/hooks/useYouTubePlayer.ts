"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export const useYouTubePlayer = (isHost: boolean, roomId: string) => {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<YT.Player | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!isHost) {
      console.log("Skipping YouTube Player initialization: not host");
      return;
    }

    console.log("Initializing YouTube Player...");

    const initializePlayer = () => {
      if (typeof YT === "undefined" || !YT.Player) {
        console.log("Waiting for YouTube IFrame API...");
        setTimeout(initializePlayer, 100);
        return;
      }

      const ytPlayer = new YT.Player(`youtube-player-${roomId}`, {
        height: "360",
        width: "640",
        playerVars: {
          autoplay: 1, // Changed to 1 to enable autoplay
          controls: 1, // Show controls so user can interact
          disablekb: 0,
          fs: 1,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            console.log("✅ YouTube Player Ready!");
            playerRef.current = event.target;
            setPlayer(event.target);
            setIsReady(true);
          },
          onStateChange: (event) => {
            const states = [
              "UNSTARTED",
              "ENDED",
              "PLAYING",
              "PAUSED",
              "BUFFERING",
              "CUED",
            ];
            console.log(
              "YouTube Player State Changed:",
              event.data,
              `(${states[event.data + 1] || "UNKNOWN"})`
            );

            if (event.data === YT.PlayerState.PLAYING) {
              console.log("▶️ Video is PLAYING");
              setIsPlaying(true);
              // Get duration from the player object, with retry logic
              const getDurationWithRetry = () => {
                const videoDuration = playerRef.current?.getDuration() || 0;
                console.log("Duration:", videoDuration);
                if (videoDuration > 0) {
                  setDuration(videoDuration);
                } else {
                  // Retry after a short delay if duration not yet available
                  setTimeout(() => {
                    const retryDuration = playerRef.current?.getDuration() || 0;
                    console.log("Duration (retry):", retryDuration);
                    if (retryDuration > 0) {
                      setDuration(retryDuration);
                    }
                  }, 500);
                }
              };
              getDurationWithRetry();
              startProgressTracking();
            } else if (event.data === YT.PlayerState.PAUSED) {
              console.log("⏸️ Video is PAUSED");
              setIsPlaying(false);
              stopProgressTracking();
            } else if (event.data === YT.PlayerState.ENDED) {
              console.log("⏹️ Video ENDED - Triggering autoplay");
              setIsPlaying(false);
              setCurrentTime(0);
              setDuration(0);
              stopProgressTracking();
              // Dispatch autoplay event immediately
              console.log("📢 Dispatching youtube-song-ended event");
              const autoplayEvent = new CustomEvent("youtube-song-ended", {
                detail: { roomId },
              });
              window.dispatchEvent(autoplayEvent);
            } else if (event.data === YT.PlayerState.BUFFERING) {
              console.log("⏳ Video is BUFFERING");
            } else if (event.data === YT.PlayerState.CUED) {
              console.log("📝 Video is CUED (ready to play)");
            }
          },
          onError: (event) => {
            console.error("YouTube Player Error:", event.data);
          },
        },
      });
    };

    // Check if API is loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isHost, roomId]);

  // Progress tracking
  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    console.log("▶️ Starting progress tracking");
    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          console.log("⏱️ Progress:", time.toFixed(1), "/", dur.toFixed(1));
          setCurrentTime(time);
          if (dur && dur !== duration) {
            setDuration(dur);
          }
        } catch (e) {
          console.error("Error getting playback time:", e);
        }
      }
    }, 1000);
  }, [duration]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  // Play a video
  const playVideo = useCallback(
    async (videoId: string, startSeconds: number = 0) => {
      if (!player || !isReady) {
        console.error("❌ Player not ready");
        return;
      }

      try {
        console.log(
          "🎵 Loading video:",
          videoId,
          "starting at",
          startSeconds,
          "seconds"
        );
        setCurrentVideoId(videoId);

        // Load the video (this will cue it)
        if (startSeconds > 0) {
          player.loadVideoById(videoId, startSeconds);
        } else {
          player.loadVideoById(videoId);
        }

        console.log("✅ Video load command sent");

        // The video should auto-play due to autoplay:1 setting
        // But let's force it after a brief delay to be sure
        setTimeout(() => {
          if (player && player.playVideo) {
            console.log("🎬 Forcing playVideo()...");
            player.playVideo();
          }
        }, 300);
      } catch (error) {
        console.error("❌ Error playing video:", error);
      }
    },
    [player, isReady]
  );

  // Pause
  const pause = useCallback(async () => {
    if (!player) return;

    try {
      player.pauseVideo();
      console.log("✅ Paused");
    } catch (error) {
      console.error("Error pausing:", error);
    }
  }, [player]);

  // Resume
  const resume = useCallback(async () => {
    if (!player) return;

    try {
      player.playVideo();
      console.log("✅ Resumed");
    } catch (error) {
      console.error("Error resuming:", error);
    }
  }, [player]);

  // Seek
  const seek = useCallback(
    async (seconds: number) => {
      if (!player) return;

      try {
        player.seekTo(seconds, true);
        console.log("✅ Seeked to", seconds);
      } catch (error) {
        console.error("Error seeking:", error);
      }
    },
    [player]
  );

  return {
    player,
    isReady,
    isPlaying,
    currentVideoId,
    duration,
    currentTime,
    playVideo,
    pause,
    resume,
    seek,
  };
};
