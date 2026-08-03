import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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

  const redirectToWatch = useCallback(() => {
    const firstEpisode = data.episodes?.[0];

    if (!firstEpisode) return;

    router.push(`/watch/${firstEpisode.id}?type=episode&seriesId=${data.id}`);
  }, [router, data]);
  const handleCardClick = useCallback(() => {
    if (window.innerWidth < 640) {
      router.push(`/series/${data.id}`);
      return;
    }

    redirectToWatch();
  }, [router, data.id, redirectToWatch]);

  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw]">
      <img
        onClick={handleCardClick}
        src={data.thumbnailUrl}
        alt={data.title}
        draggable={false}
        className="
          cursor-pointer
          object-cover
          transition
          shadow-xl
          rounded-md
          group-hover:opacity-90
          sm:group-hover:opacity-0
          delay-300
          w-full
          h-[12vw]
        "
      />

      <div
        className="
          opacity-0
          absolute
          top-0
          transition
          duration-200
          z-10
          invisible
          sm:visible
          delay-300
          w-full
          scale-0
          group-hover:scale-110
          group-hover:-translate-y-[6vw]
          group-hover:translate-x-[2vw]
          group-hover:opacity-100
        "
      >
        <img
          onClick={redirectToWatch}
          src={data.thumbnailUrl}
          alt={data.title}
          draggable={false}
          className="
            cursor-pointer
            object-cover
            shadow-xl
            rounded-t-md
            w-full
            h-[12vw]
          "
        />

        <div
          className="
            z-10
            bg-zinc-800
            p-2
            lg:p-4
            absolute
            w-full
            shadow-md
            rounded-b-md
          "
        >
          <div className="flex items-center gap-3">
            <SeriesPlayButton
              seriesId={data.id}
              firstEpisodeId={data.episodes?.[0]?.id}
            />

            <SeriesFavoriteButton seriesId={data.id} />

            <div
              onClick={() => openModal(data.id)}
              className="
                cursor-pointer
                ml-auto
                group/item
                w-6
                h-6
                lg:w-10
                lg:h-10
                border-white
                border-2
                rounded-full
                flex
                justify-center
                items-center
                transition
                hover:border-neutral-300
              "
            >
              <ChevronDownIcon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
            </div>
          </div>

          <p className="text-green-400 font-semibold mt-4">New</p>

          <div className="flex mt-4 gap-2 items-center">
            <p className="text-white text-[10px] lg:text-sm">
              {data.episodes?.length || 0} Episodes
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[8px] lg:text-sm text-white">
            <p>{data.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;
