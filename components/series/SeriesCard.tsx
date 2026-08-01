import React from "react";
import { useRouter } from "next/router";

import { SeriesInterface } from "@/types";

interface SeriesCardProps {
  data: SeriesInterface;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ data }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/series/${data.id}`)}
      className="cursor-pointer rounded-md overflow-hidden transition hover:scale-105"
    >
      <img
        src={data.thumbnailUrl}
        alt={data.title}
        className="w-full h-[12vw] object-cover"
      />

      <div className="mt-2">
        <p className="text-white font-semibold">{data.title}</p>

        <p className="text-zinc-400 text-sm">{data.genre}</p>
      </div>
    </div>
  );
};

export default SeriesCard;
