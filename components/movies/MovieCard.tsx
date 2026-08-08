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
      <div className="relative overflow-hidden rounded-md">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          draggable={false}
          onClick={redirectToWatch}
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
        <div
          className="
            absolute
            bottom-4
            left-4
            opacity-0
            translate-y-3
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
            duration-300
          "
        >
          <button
            onClick={redirectToWatch}
            className="
              flex
              items-center
              gap-4
              bg-white
              text-black
              px-5
              py-3
              rounded-full
              font-semibold
              shadow-xl
            "
          >
            <PlayIcon className="w-5 h-5" />
            Play
          </button>
        </div>

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
          <FavoriteButton movieId={data.id} />

          <button
            onClick={() => openModal(data.id)}
            className="
              w-10
              h-10
              rounded-md
              bg-black/50
              backdrop-blur-md
              flex
              items-center
              justify-center
              hover:bg-black/70
            "
          >
            <ChevronDownIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="mt-4 px-1">
        <p className="text-emerald-400 text-xs font-medium tracking-wide">
          {data.genre}
        </p>

        <h3
          className="
            mt-1
            text-white
            text-xl md:text-2xl
            font-semibold
            line-clamp-2
          "
        >
          {data.title}
        </h3>

        <p className="mt-2 text-sm text-zinc-400">{data.duration}</p>
      </div>
    </div>
  );
};

export default MovieCard;
