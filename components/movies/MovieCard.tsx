import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { ChevronDownIcon, PlayIcon } from "@heroicons/react/24/solid";

import { MovieInterface } from "@/types";
import FavoriteButton from "@/components/FavoriteButton";
import useInfoModalStore from "@/hooks/useInfoModalStore";

interface MovieCardProps {
  data: MovieInterface;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  const router = useRouter();
  const { openModal } = useInfoModalStore();

  const redirectToWatch = useCallback(() => {
    router.push(`/watch/${data.id}`);
  }, [router, data.id]);

  return (
    <div
      className="
        group
        relative
        w-full
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Image */}
      <div
        onClick={redirectToWatch}
        className="relative overflow-hidden rounded-md cursor-pointer"
      >
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          draggable={false}
          className="
            w-full
            aspect-[2/3]
            object-cover
            cursor-pointer
            transition-transform
            duration-500
            group-hover:scale-[1.04]
          "
        />

        {/* Gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/10
            to-transparent
          "
        />

        {/* Play Button */}

        {/* Top Right Buttons */}
        <div
          className="
            absolute
            top-4
            right-4
            flex
            gap-4
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton movieId={data.id} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(data.id);
            }}
            className="
    flex items-center justify-center
    w-8 h-8
    sm:w-9 sm:h-9
    md:w-10 md:h-10
    rounded-md
    bg-black/50
    backdrop-blur-md
    hover:bg-black/70
    transition
  "
          >
            <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="mt-3 px-1">
        <p className="text-emerald-400 text-[10px] sm:text-xs font-medium tracking-wide">
          {data.genre}
        </p>

        <h3
          className="
      mt-1
      text-white
      text-sm
      sm:text-base
      md:text-lg
      font-semibold
      leading-tight
      line-clamp-2
    "
        >
          {data.title}
        </h3>

        <p className="mt-1.5 text-[10px] sm:text-xs md:text-sm text-zinc-400">
          {data.duration}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
