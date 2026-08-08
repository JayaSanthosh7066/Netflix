import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import useMovie from "@/hooks/useMovie";
import useEpisode from "@/hooks/useEpisode";

const Watch = () => {
  const router = useRouter();

  const { movieId, type } = router.query;

  const movie = useMovie(type === "episode" ? undefined : (movieId as string));

  const episode = useEpisode(
    type === "episode" ? (movieId as string) : undefined,
  );

  const data = type === "episode" ? episode.data : movie.data;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeDisplayRef = useRef<HTMLSpanElement | null>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressThumbRef = useRef<HTMLDivElement>(null);
  const isSeekingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // -----------------------------
  // PLAY / PAUSE
  // -----------------------------

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Video play failed:", error);
      }
    } else {
      video.pause();
    }
  };

  // -----------------------------
  // SEEK
  // -----------------------------

  const skip = (seconds: number) => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration,
    );
  };

  // -----------------------------
  // PROGRESS
  // -----------------------------

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setDuration(video.duration);
  };

  const seekFromPointer = (clientX: number) => {
    const video = videoRef.current;
    const container = progressContainerRef.current;

    if (!video || !container || !video.duration) return;

    const rect = container.getBoundingClientRect();

    let percentage = (clientX - rect.left) / rect.width;

    percentage = Math.max(0, Math.min(1, percentage));

    const newTime = percentage * video.duration;

    video.currentTime = newTime;

    // Immediately move the UI
    if (progressTrackRef.current) {
      progressTrackRef.current.style.setProperty(
        "--progress",
        `${percentage * 100}%`,
      );
    }

    if (progressThumbRef.current) {
      progressThumbRef.current.style.left = `${percentage * 100}%`;
    }

    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${formatTime(newTime)} / ${formatTime(video.duration)}`;
    }
  };

  const handleProgressPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    isSeekingRef.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);

    seekFromPointer(event.clientX);
  };

  const handleProgressPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isSeekingRef.current) return;

    seekFromPointer(event.clientX);
  };

  const handleProgressPointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    isSeekingRef.current = false;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const updateProgress = () => {
      const video = videoRef.current;
      const thumb = progressThumbRef.current;
      const timeDisplay = timeDisplayRef.current;

      if (video && thumb && video.duration && !isSeekingRef.current) {
        const percentage = video.currentTime / video.duration;

        if (progressTrackRef.current) {
          progressTrackRef.current.style.setProperty(
            "--progress",
            `${percentage * 100}%`,
          );
        }

        if (progressThumbRef.current) {
          progressThumbRef.current.style.left = `${percentage * 100}%`;
        }

        // Time
        if (timeDisplay) {
          timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // -----------------------------
  // VOLUME
  // -----------------------------

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;

    setIsMuted(video.muted);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;

    if (!video) return;

    const newVolume = Number(event.target.value);

    video.volume = newVolume;

    if (newVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }

    setVolume(newVolume);
  };

  // -----------------------------
  // FULLSCREEN
  // -----------------------------

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // -----------------------------
  // PLAYBACK SPEED
  // -----------------------------

  const changePlaybackRate = () => {
    const video = videoRef.current;

    if (!video) return;

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

    const currentIndex = speeds.indexOf(playbackRate);

    const nextIndex = (currentIndex + 1) % speeds.length;

    const nextSpeed = speeds[nextIndex];

    video.playbackRate = nextSpeed;

    setPlaybackRate(nextSpeed);
  };

  // -----------------------------
  // FORMAT TIME
  // -----------------------------

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) {
      return "0:00";
    }

    const hours = Math.floor(time / 3600);

    const minutes = Math.floor((time % 3600) / 60);

    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // -----------------------------
  // SHOW CONTROLS
  // -----------------------------

  const handleMouseMove = () => {
    setShowControls(true);

    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // -----------------------------
  // KEYBOARD CONTROLS
  // -----------------------------

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      }

      if (event.key === "ArrowLeft") {
        skip(-10);
      }

      if (event.key === "ArrowRight") {
        skip(10);
      }

      if (event.key.toLowerCase() === "m") {
        toggleMute();
      }

      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playbackRate, isPlaying]);

  // -----------------------------
  // CLEANUP
  // -----------------------------

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      className="relative h-screen w-screen overflow-hidden bg-black"
    >
      {/* VIDEO */}

      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        autoPlay
        src={data?.videoUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {/* TOP GRADIENT */}

      <div
        className={`
          pointer-events-none
          absolute
          top-0
          left-0
          right-0
          h-40
          bg-gradient-to-b
          from-black/80
          to-transparent
          transition-opacity
          duration-300
          ${showControls ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* TOP BAR */}

      <div
        className={`
          absolute
          top-0
          left-0
          right-0
          z-20
          flex
          items-center
          justify-between
          px-4
          py-4
          md:px-8
          md:py-6
          transition-opacity
          duration-300
          ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <button
            onClick={() => router.back()}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-black/40
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
              md:h-11
              md:w-11
            "
          >
            <ArrowLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-white md:text-2xl">
              {data?.title}
            </h1>

            {data?.description && (
              <p className="hidden max-w-xl truncate text-sm text-white/60 md:block">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* CLOSE */}

        <button
          onClick={() => router.back()}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-black/40
            text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
            md:h-11
            md:w-11
          "
        >
          <XMarkIcon className="h-6 w-6 md:h-7 md:w-7" />
        </button>
      </div>

      {/* CENTER PLAY BUTTON */}

      <div
        className={`
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          transition-opacity
          duration-300
          ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        <button
          onClick={togglePlay}
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-red-600
            text-white
            backdrop-blur-md
            transition
            hover:scale-110
            hover:bg-red-600
            md:h-20
            md:w-20
          "
        >
          {isPlaying ? (
            <PauseIcon className="h-7 w-7 md:h-9 md:w-9" />
          ) : (
            <PlayIcon className="ml-1 h-7 w-7 md:h-9 md:w-9" />
          )}
        </button>
      </div>

      {/* BOTTOM GRADIENT */}

      <div
        className={`
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-52
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-transparent
          transition-opacity
          duration-300
          ${showControls ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* CONTROLS */}

      <div
        className={`
          absolute
          bottom-0
          left-0
          right-0
          z-20
          px-4
          pb-4
          md:px-8
          md:pb-6
          transition-opacity
          duration-300
          ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        {/* PROGRESS */}

        <div
          ref={progressContainerRef}
          className="
    relative
    mb-3
    h-5
    w-full
    cursor-pointer
    touch-none
  "
          onPointerDown={handleProgressPointerDown}
          onPointerMove={handleProgressPointerMove}
          onPointerUp={handleProgressPointerUp}
          onPointerCancel={handleProgressPointerUp}
        >
          {/* SINGLE PROGRESS TRACK */}
          <div
            ref={progressTrackRef}
            className="
      absolute
      left-0
      right-0
      top-1/2
      h-1
      -translate-y-1/2
      rounded-full
    "
            style={{
              background:
                "linear-gradient(to right, #dc2626 0%, #dc2626 var(--progress, 0%), rgba(255,255,255,0.4) var(--progress, 0%), rgba(255,255,255,0.4) 100%)",
            }}
          />

          {/* THUMB */}
          <div
            ref={progressThumbRef}
            className="
      absolute
      left-0
      top-1/2
      z-10
      h-3.5
      w-3.5
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-red-600
      shadow-md
      md:h-4
      md:w-4
    "
          />
        </div>

        {/* CONTROL ROW */}

        <div className="flex items-center justify-between">
          {/* LEFT CONTROLS */}

          <div className="flex items-center gap-2 md:gap-4">
            {/* PLAY */}

            <button
              onClick={togglePlay}
              className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        text-white
        transition-all
        duration-200
        hover:bg-white/10
        hover:scale-105
        active:scale-95
        md:h-10
        md:w-10
      "
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <PlayIcon className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </button>

            {/* BACK 10 */}

            {/* BACK 10 */}
            <button
              onClick={() => skip(-10)}
              title="Back 10 seconds"
              className="
    flex
    h-9
    items-center
    gap-1
    rounded-md
    px-1
    text-white
    transition-all
    duration-200
    hover:bg-white/10
    active:scale-95
    md:h-10
    md:px-2
  "
            >
              <ArrowUturnLeftIcon className="h-5 w-5 md:h-6 md:w-6" />

              <span className="text-[11px] font-semibold md:text-xs">10s</span>
            </button>

            {/* FORWARD 10 */}
            <button
              onClick={() => skip(10)}
              title="Forward 10 seconds"
              className="
    flex
    h-9
    items-center
    gap-1
    rounded-md
    px-1
    text-white
    transition-all
    duration-200
    hover:bg-white/10
    active:scale-95
    md:h-10
    md:px-2
  "
            >
              <ArrowUturnRightIcon className="h-5 w-5 md:h-6 md:w-6" />

              <span className="text-[11px] font-semibold md:text-xs">10s</span>
            </button>

            {/* VOLUME */}

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white transition hover:text-white/70"
              >
                {isMuted || volume === 0 ? (
                  <SpeakerXMarkIcon className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </button>

              {/* VOLUME SLIDER */}

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(
      to right,
      white 0%,
      white ${(isMuted ? 0 : volume) * 100}%,
      rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%,
      rgba(255,255,255,0.3) 100%
    )`,
                }}
                className="
    hidden
    h-1
    w-20
    cursor-pointer
    appearance-none
    rounded-full
    sm:block
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-3
    [&::-webkit-slider-thumb]:w-3
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-moz-range-thumb]:h-3
    [&::-moz-range-thumb]:w-3
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:border-0
    [&::-moz-range-thumb]:bg-white
  "
              />
            </div>

            {/* TIME */}

            <span
              ref={timeDisplayRef}
              className="text-xs text-white/80 md:text-sm"
            >
              0:00 / {formatTime(duration)}
            </span>
          </div>

          {/* RIGHT CONTROLS */}

          <div className="flex items-center gap-3 md:gap-5">
            {/* SPEED */}

            <button
              onClick={changePlaybackRate}
              className="
        flex
        h-8
        min-w-[42px]
        items-center
        justify-center
        rounded-md
        bg-white/10
        px-2
        text-xs
        font-semibold
        text-white
        backdrop-blur-md
        transition-all
        duration-200
        hover:bg-white/20
        active:scale-95
        md:h-9
        md:min-w-[46px]
        md:text-sm
      "
            >
              {playbackRate}x
            </button>

            {/* FULLSCREEN */}

            <button
              onClick={toggleFullscreen}
              className="text-white transition hover:text-white/70"
            >
              <ArrowsPointingOutIcon className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
