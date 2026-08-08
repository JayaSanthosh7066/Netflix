import React from "react";
import { PlayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface MobileEpisodeCardProps {
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

const MobileEpisodeCard: React.FC<MobileEpisodeCardProps> = ({
  episode,
  seriesId,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/watch/${episode.id}?type=episode&seriesId=${seriesId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        px-5
        py-4
        active:bg-zinc-900
        transition-colors
        cursor-pointer
      "
    >
      {/* TOP ROW */}

      <div className="flex gap-4">
        {/* THUMBNAIL */}

        <div
          className="
            relative
            w-[125px]
            h-[78px]
            shrink-0
            overflow-hidden
            rounded-md
            bg-zinc-900
          "
        >
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="
              h-full
              w-full
              object-cover
            "
          />

          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-black/20" />

          {/* PLAY */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/60
              "
            >
              <PlayIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* TITLE + META */}

        {/* TITLE + DESCRIPTION */}

        <div className="min-w-0 flex-1 pr-1">
          <h3
            className="
      text-[15px]
      font-bold
      leading-5
      text-white
      line-clamp-1
    "
          >
            Episode {episode.episodeNumber}: {episode.title}
          </h3>

          <p
            className="
      mt-2
      text-sm
      leading-5
      text-zinc-400
      line-clamp-2
    "
          >
            {episode.description}
          </p>
        </div>

        {/* DURATION */}

        <div className="shrink-0 self-center text-sm text-zinc-400">
          {episode.duration}
        </div>
      </div>
    </div>
  );
};

export default MobileEpisodeCard;
