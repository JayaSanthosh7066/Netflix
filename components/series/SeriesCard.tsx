import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { ChevronDownIcon, PlayIcon } from "@heroicons/react/24/solid";

import { SeriesInterface } from "@/types";
import SeriesPlayButton from "@/components/series/SeriesPlayButton";
import SeriesFavoriteButton from "@/components/series/SeriesFavoriteButton";
import useSeriesInfoModalStore from "@/hooks/useSeriesInfoModalStore";

interface SeriesCardProps {
  data: SeriesInterface;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ data }) => {
  const router = useRouter();
  const { openModal } = useSeriesInfoModalStore();

  const firstEpisode = data.episodes?.[0];

  const redirectToWatch = useCallback(() => {
    if (!firstEpisode) return;

    router.push(`/watch/${firstEpisode.id}?type=episode&seriesId=${data.id}`);
  }, [router, firstEpisode, data.id]);

  const handleCardClick = () => {
    if (window.innerWidth < 768) {
      router.push(`/series/${data.id}`);
    } else {
      openModal(data.id);
    }
  };

  return (
    <div
      className="group relative w-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          draggable={false}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-105
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

        {/* TOP RIGHT BUTTONS */}
        <div
          className="
            absolute
            top-4
            right-4
            flex
            gap-3
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SeriesFavoriteButton seriesId={data.id} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(data.id);
            }}
            className="
    flex
    items-center
    justify-center
    w-8
    h-8
    sm:w-9
    sm:h-9
    md:w-10
    md:h-10
    rounded-md
    bg-black/50
    backdrop-blur-md
    hover:bg-black/70
    transition
  "
          >
            <ChevronDownIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* TEXT */}
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
          {data.episodes?.length || 0} Episodes
        </p>
      </div>
    </div>
  );
};

export default SeriesCard;
