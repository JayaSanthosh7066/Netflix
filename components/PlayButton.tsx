import React from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface PlayButtonProps {
  movieId: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ movieId }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/watch/${movieId}`)}
      className="
        group
        inline-flex
        items-center
        justify-center
        gap-3

        h-14
        md:h-16

        px-7
        md:px-8

        rounded-lg

        bg-white
        text-black

        font-semibold
        text-lg

        shadow-2xl
        transition-all
        duration-300

        hover:bg-neutral-200
        hover:scale-[1.03]
        active:scale-95
      "
    >
      <PlayIcon
        className="
          w-7
          h-7
          transition-transform
          duration-300
          group-hover:translate-x-0.5
        "
      />

      <span>Play</span>
    </button>
  );
};

export default PlayButton;
