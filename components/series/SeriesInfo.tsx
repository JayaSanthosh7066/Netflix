import React from "react";
import { PlayIcon } from "@heroicons/react/24/solid";

interface SeriesInfoProps {
  title: string;
  genre: string;
  description: string;
}

const SeriesInfo: React.FC<SeriesInfoProps> = ({
  title,
  genre,
  description,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-8 -mt-32 relative z-20">
      <h1 className="text-white text-5xl font-bold">{title}</h1>

      <p className="text-zinc-400 text-lg mt-4">{genre}</p>

      <p className="text-white mt-6 leading-8 max-w-3xl">{description}</p>

      <button
        className="
          mt-8
          flex
          items-center
          gap-2
          bg-white
          text-black
          px-6
          py-3
          rounded-md
          font-semibold
          hover:bg-neutral-300
          transition
        "
      >
        <PlayIcon className="w-6" />
        Play
      </button>
    </div>
  );
};

export default SeriesInfo;
