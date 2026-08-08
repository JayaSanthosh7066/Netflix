import React from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface SeriesModalEpisodeCardProps {
  episode: {
    id: string;
    episodeNumber: number;
    title: string;
    description: string;
    duration: string;
    thumbnailUrl: string;
  };
  seriesId: string;
}

const SeriesModalEpisodeCard: React.FC<SeriesModalEpisodeCardProps> = ({
  episode,
  seriesId,
}) => {
  const router = useRouter();

  const handleEpisodeClick = () => {
    router.push(`/watch/${episode.id}?type=episode&seriesId=${seriesId}`);
  };

  return (
    <div
      onClick={handleEpisodeClick}
      className="
        group
        flex
        flex-col
        md:flex-row
        gap-3
        md:gap-5
        p-3
        md:p-5
        rounded-lg
        md:rounded-xl
        hover:bg-zinc-800
        transition-all
        duration-300
        cursor-pointer
      "
    >
      {/* Episode Number */}

      <div className="hidden md:flex items-center justify-center w-12 shrink-0">
        <span className="text-2xl lg:text-3xl font-bold text-zinc-500">
          {episode.episodeNumber}
        </span>
      </div>

      {/* Thumbnail */}

      <div
        className="
          relative
          w-full
          md:w-56
          lg:w-64
          shrink-0
          aspect-video
          rounded-md
          md:rounded-lg
          overflow-hidden
        "
      >
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />

        {/* Play Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-black/40
            opacity-0
            group-hover:opacity-100
            transition
            flex
            items-center
            justify-center
          "
        >
          <PlayIcon className="w-10 h-10 md:w-14 md:h-14 text-white" />
        </div>
      </div>

      {/* Details */}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3
              className="
                text-base
                md:text-xl
                font-semibold
                text-white
                line-clamp-2
              "
            >
              {episode.title}
            </h3>

            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Episode {episode.episodeNumber}
            </p>
          </div>

          <p className="text-zinc-400 text-xs md:text-sm shrink-0">
            {episode.duration}
          </p>
        </div>

        <p
          className="
            text-zinc-400
            text-sm
            md:text-base
            mt-2
            md:mt-4
            leading-6
            md:leading-7
            line-clamp-3
          "
        >
          {episode.description}
        </p>
      </div>
    </div>
  );
};

export default SeriesModalEpisodeCard;
