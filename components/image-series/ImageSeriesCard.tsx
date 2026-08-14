import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { ImageSeriesInterface } from "@/types";
import useImageSeriesInfoModalStore from "@/hooks/useImageSeriesInfoModalStore";

interface ImageSeriesCardProps {
  data: ImageSeriesInterface;
}

const ImageSeriesCard: React.FC<ImageSeriesCardProps> = ({ data }) => {
  const { openModal } = useImageSeriesInfoModalStore();
  console.log("IMAGE SERIES CARD DATA:", data);

  const handleCardClick = () => {
    openModal(data.id);
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

        {/* TOP RIGHT BUTTON */}
        <div
          className="
            absolute
            top-4
            right-4
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >
          <button
            type="button"
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

        <p
          className="
            mt-1.5
            text-[10px]
            sm:text-xs
            md:text-sm
            text-zinc-400
          "
        >
          {data.images?.length || 0} Images
        </p>
      </div>
    </div>
  );
};

export default ImageSeriesCard;
