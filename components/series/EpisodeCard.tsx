import React from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useCallback } from "react";
interface EpisodeCardProps {
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

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, seriesId }) => {
  const router = useRouter();

  const redirectToWatch = useCallback(() => {
    router.push(`/watch/${episode.id}?type=episode&seriesId=${seriesId}`);
  }, [router, episode.id, seriesId]);
  return (
    <div
      onClick={redirectToWatch}
      className="
    group
    flex
    gap-6
    bg-zinc-900
    hover:bg-zinc-800
    transition-all
    duration-300
    rounded-lg
    p-4
    cursor-pointer
  "
    >
      <div className="relative w-48 h-28 overflow-hidden rounded-md">
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
      duration-300
      flex
      items-center
      justify-center
    "
        >
          <PlayIcon
            className="
    w-12
    h-12
    text-white
    scale-75
    group-hover:scale-100
    transition-transform
    duration-300
  "
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            Episode {episode.episodeNumber}: {episode.title}
          </h3>

          <span className="text-zinc-400">{episode.duration}</span>
        </div>

        <p className="text-zinc-400 mt-3 line-clamp-3">{episode.description}</p>
      </div>
    </div>
  );
};

export default EpisodeCard;
