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

  return (
    <div
      onClick={() =>
        router.push(`/watch/${episode.id}?type=episode&seriesId=${seriesId}`)
      }
      className="
        group
        flex
        flex-col
        md:flex-row
        gap-5
        p-5
        rounded-xl
        hover:bg-zinc-800
        transition-all
        duration-300
        cursor-pointer
      "
    >
      {/* Episode Number */}

      <div className="hidden md:flex items-center justify-center w-12">
        <span className="text-3xl font-bold text-zinc-500">
          {episode.episodeNumber}
        </span>
      </div>

      {/* Thumbnail */}

      <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden">
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
          <PlayIcon className="w-14 h-14 text-white" />
        </div>
      </div>

      {/* Details */}

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {episode.title}
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              Episode {episode.episodeNumber}
            </p>
          </div>

          <p className="text-zinc-400">{episode.duration}</p>
        </div>

        <p className="text-zinc-400 mt-4 leading-7 line-clamp-3">
          {episode.description}
        </p>
      </div>
    </div>
  );
};

export default SeriesModalEpisodeCard;
