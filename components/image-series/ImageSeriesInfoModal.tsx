import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";

import useImageSeriesInfoModalStore from "@/hooks/useImageSeriesInfoModalStore";
import useImageSeries from "@/hooks/useImageSeries";

interface ImageSeriesInfoModalProps {
  visible?: boolean;
  onClose: () => void;
}

const IMAGE_DURATION = 8000;
const TRANSITION_START = 0.9;
const IMAGE_SWAP = 0.94;

const ImageSeriesInfoModal: React.FC<ImageSeriesInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const IMAGE_SERIES_MUSIC = ["/music-1.mp3", "/music-2.mp3", "/music-3.mp3"];
  const { imageSeriesId } = useImageSeriesInfoModalStore();
  const { data: imageSeries } = useImageSeries(imageSeriesId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  type TransitionPhase = "idle" | "closing" | "opening";

  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("idle");
  const [progress, setProgress] = useState(0);

  const images = imageSeries?.images || [];
  const currentImage = images[selectedImageIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!visible) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      return;
    }

    const randomIndex = Math.floor(Math.random() * IMAGE_SERIES_MUSIC.length);

    const selectedMusic = IMAGE_SERIES_MUSIC[randomIndex];

    const audio = new Audio(selectedMusic);

    audio.loop = true;
    audio.volume = 0.3;
    audio.muted = false;

    audioRef.current = audio;

    audio.play().catch((error) => {
      console.log("Music autoplay was blocked:", error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [visible]);

  /*
   * ---------------------------------------------------------
   * CHANGE IMAGE
   * ---------------------------------------------------------
   */

  const changeImage = useCallback(
    (nextIndex: number) => {
      if (!images.length) return;

      if (nextIndex < 0 || nextIndex >= images.length) {
        return;
      }

      setSelectedImageIndex(nextIndex);
      setProgress(0);
      setTransitionPhase("idle");
      setIsMuted(false);
    },
    [images.length],
  );

  /*
   * ---------------------------------------------------------
   * NEXT IMAGE
   * ---------------------------------------------------------
   */

  const handleNext = useCallback(() => {
    if (!images.length) return;

    const nextIndex =
      selectedImageIndex >= images.length - 1 ? 0 : selectedImageIndex + 1;

    changeImage(nextIndex);
  }, [images.length, selectedImageIndex, changeImage]);

  /*
   * ---------------------------------------------------------
   * PREVIOUS IMAGE
   * ---------------------------------------------------------
   */

  const handlePrevious = useCallback(() => {
    if (!images.length) return;

    const previousIndex =
      selectedImageIndex <= 0 ? images.length - 1 : selectedImageIndex - 1;

    changeImage(previousIndex);
  }, [images.length, selectedImageIndex, changeImage]);

  /*
   * ---------------------------------------------------------
   * RESET WHEN OPENING
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!visible) {
      return;
    }

    setSelectedImageIndex(0);
    setProgress(0);
    setTransitionPhase("idle");
  }, [visible, imageSeriesId]);

  /*
   * ---------------------------------------------------------
   * AUTOMATIC SLIDESHOW
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!visible || images.length <= 1) return;

    const startedAt = performance.now();

    let hasSwapped = false;

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;

      const normalizedProgress = Math.min(elapsed / IMAGE_DURATION, 1);

      const percentage = normalizedProgress * 100;

      setProgress(percentage);

      /*
       * ------------------------------------------
       * 0% → 75%
       * CURRENT IMAGE
       * ------------------------------------------
       */

      if (normalizedProgress < TRANSITION_START) {
        setTransitionPhase("idle");
      } else if (normalizedProgress < IMAGE_SWAP) {
        /*
         * ------------------------------------------
         * 75% → 87.5%
         * CLOSE CURRENT IMAGE
         * ------------------------------------------
         */
        setTransitionPhase("closing");
      } else {
        /*
         * ------------------------------------------
         * 87.5%
         * CHANGE IMAGE
         * ------------------------------------------
         */
        if (!hasSwapped) {
          hasSwapped = true;

          setProgress(0);

          setSelectedImageIndex((currentIndex) => {
            const nextIndex =
              currentIndex >= images.length - 1 ? 0 : currentIndex + 1;

            return nextIndex;
          });
        }
      }

      /*
       * ------------------------------------------
       * END OF THIS IMAGE'S TIMELINE
       * ------------------------------------------
       */

      if (normalizedProgress >= 1) {
        clearInterval(interval);

        // The next image's effect will start a fresh
        // progress cycle because selectedImageIndex
        // has changed.
      }
    }, 16);

    return () => {
      clearInterval(interval);
    };
  }, [visible, selectedImageIndex, images.length]);

  /*
   * ---------------------------------------------------------
   * CLOSE
   * ---------------------------------------------------------
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    const nextMuted = !audioRef.current.muted;

    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  /*
   * ---------------------------------------------------------
   * KEYBOARD
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }

      if (event.key === "ArrowLeft") {
        handlePrevious();
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, handleClose, handlePrevious, handleNext]);

  /*
   * ---------------------------------------------------------
   * BODY LOCK
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible || !currentImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black">
      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden">
        <img
          src={currentImage.imageUrl}
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            scale-[1.25]
            object-cover
            blur-[45px]
            saturate-[1.35]
            brightness-[0.65]
            opacity-90
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(
              ellipse_at_center,
              transparent_10%,
              rgba(0,0,0,0.08)_45%,
              rgba(0,0,0,0.55)_100%
            )]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/10
            via-transparent
            to-black/30
          "
        />
      </div>

      {/* =====================================================
          PROGRESS BAR
      ===================================================== */}

      <div className="absolute left-4 right-4 top-5 z-50 flex gap-1 md:left-5 md:right-5">
        {images.map((_: any, index: number) => {
          const isPast = index < selectedImageIndex;
          const isCurrent = index === selectedImageIndex;

          return (
            <div
              key={index}
              className="
                relative
                h-[4px]
                flex-1
                overflow-hidden
                rounded-full
                bg-white/30
              "
            >
              <div
                className={`
                  absolute
                  inset-y-0
                  left-0
                  rounded-full
                  bg-white
                  ${isPast ? "w-full" : isCurrent ? "" : "w-0"}
                `}
                style={
                  isCurrent
                    ? {
                        width: `${progress}%`,
                      }
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>

      {/* =====================================================
          CLOSE BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={toggleMute}
        className="
    absolute
    right-16
    top-8
    z-50
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    bg-black/30
    text-white
    backdrop-blur-sm
    transition
    duration-200
    hover:bg-black/50
    hover:scale-105
    md:right-20
  "
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="h-6 w-6" />
        ) : (
          <SpeakerWaveIcon className="h-6 w-6" />
        )}
      </button>

      <button
        type="button"
        onClick={handleClose}
        className="
          absolute
          right-5
          top-8
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          text-white
          transition
          duration-200
          hover:scale-110
          hover:text-zinc-300
          md:right-7
        "
        aria-label="Close"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>

      {/* =====================================================
          PREVIOUS AREA
      ===================================================== */}

      {selectedImageIndex > 0 && (
        <button
          type="button"
          onClick={handlePrevious}
          className="
            absolute
            left-0
            top-0
            z-40
            h-full
            w-[18%]
            cursor-pointer
          "
          aria-label="Previous image"
        >
          <div
            className="
              absolute
              left-5
              top-1/2
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-black/30
              text-white
              opacity-0
              backdrop-blur-sm
              transition
              duration-200
              hover:opacity-100
              md:left-8
            "
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </div>
        </button>
      )}

      {/* =====================================================
          NEXT AREA
      ===================================================== */}

      {selectedImageIndex < images.length - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="
            absolute
            right-0
            top-0
            z-40
            h-full
            w-[18%]
            cursor-pointer
          "
          aria-label="Next image"
        >
          <div
            className="
              absolute
              right-5
              top-1/2
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-black/30
              text-white
              opacity-0
              backdrop-blur-sm
              transition
              duration-200
              hover:opacity-100
              md:right-8
            "
          >
            <ChevronRightIcon className="h-7 w-7" />
          </div>
        </button>
      )}

      {/* =====================================================
          IMAGE STAGE
      ===================================================== */}

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 py-14 md:px-16 md:py-16">
        <img
          key={selectedImageIndex}
          src={currentImage.imageUrl}
          alt=""
          draggable={false}
          className="
    max-h-[calc(100vh-7rem)]
    max-w-[calc(100vw-3rem)]
    object-contain
    shadow-2xl
    animate-image-open
  "
        />
      </div>
    </div>
  );
};

export default ImageSeriesInfoModal;
