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
      className="
        flex
        gap-6
        bg-zinc-900
        hover:bg-zinc-800
        transition
        rounded-lg
        p-4
      "
    >
      <img
        src={episode.thumbnailUrl}
        alt={episode.title}
        className="w-48 h-28 rounded-md object-cover"
      />

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            Episode {episode.episodeNumber}: {episode.title}
          </h3>

          <span className="text-zinc-400">{episode.duration}</span>
        </div>

        <p className="text-zinc-400 mt-3 line-clamp-3">{episode.description}</p>
      </div>

      <button
        className="
          w-12
          h-12
          rounded-full
          bg-white
          hover:bg-neutral-300
          transition
          flex
          items-center
          justify-center
          self-center
        "
        onClick={redirectToWatch}
      >
        <PlayIcon className="w-6 text-black" />
      </button>
    </div>
  );
};

export default EpisodeCard;
