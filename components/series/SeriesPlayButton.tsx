import React from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface SeriesPlayButtonProps {
  seriesId: string;
  firstEpisodeId?: string;
}

const SeriesPlayButton: React.FC<SeriesPlayButtonProps> = ({
  seriesId,
  firstEpisodeId,
}) => {
  const router = useRouter();

  const handlePlay = () => {
    if (!firstEpisodeId) return;

    router.push(
      `/watch/${firstEpisodeId}?type=episode&seriesId=${seriesId}&from=modal`,
    );
  };

  return (
    <button
      onClick={handlePlay}
      className="
        bg-white
        rounded-md
        py-1 md:py-2
        px-2 md:px-4
        w-auto
        text-xs lg:text-lg
        font-semibold
        flex
        flex-row
        items-center
        hover:bg-neutral-300
        transition
      "
    >
      <PlayIcon className="w-4 md:w-7 text-black mr-1" />
      Play
    </button>
  );
};

export default SeriesPlayButton;
