import React, { useCallback, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import SeriesModalEpisodeCard from "@/components/series/SeriesModalEpisodeCard";
import SeriesPlayButton from "@/components/series/SeriesPlayButton";
import SeriesFavoriteButton from "@/components/series/SeriesFavoriteButton";
import useSeriesInfoModalStore from "@/hooks/useSeriesInfoModalStore";
import useSeries from "@/hooks/useSeries";

interface SeriesInfoModalProps {
  visible?: boolean;
  onClose: any;
}

const SeriesInfoModal: React.FC<SeriesInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!visible);

  const { seriesId } = useSeriesInfoModalStore();
  const { data: series } = useSeries(seriesId);

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!visible) {
    return null;
  }
  //   if (!series) {
  //     return null;
  //   }

  return (
    <div
      className="
    fixed
    inset-0
    z-50
    bg-black/80
    overflow-y-auto
    justify-center
    md:pt-6
    pb-10
  "
    >
      <div
        className="
    relative
    w-[95%]
    md:w-[90%]
    max-w-6xl
    mx-auto
    mt-4
    mb-14
    rounded-xl
    overflow-hidden
    bg-zinc-900
  "
      >
        <div
          className={`${isVisible ? "scale-100" : "scale-0"} transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md`}
        >
          <div
            className="
    relative
    aspect-video
    w-full
  "
          >
            <img
              src={series?.bannerUrl || series?.thumbnailUrl}
              alt={series?.title}
              className="w-full h-full object-cover brightness-[50%]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/20 to-transparent" />
            <div
              onClick={handleClose}
              className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center"
            >
              <XMarkIcon className="text-white w-6" />
            </div>
            <div className="absolute bottom-[8%] left-6 md:left-10">
              <p
                className="
text-white
text-3xl
md:text-5xl
lg:text-6xl
font-black
drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]
mb-8
"
              >
                {series?.title}
              </p>
              <div className="flex items-center gap-4">
                <SeriesPlayButton
                  seriesId={series?.id ?? ""}
                  firstEpisodeId={series?.episodes?.[0]?.id}
                />

                <SeriesFavoriteButton seriesId={series?.id ?? ""} />
              </div>
            </div>
          </div>
          <div className="px-6 md:px-12 py-8">
            {/* Metadata */}

            <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
              <span className="text-green-400 font-semibold">New</span>

              <span className="text-white">
                {series?.episodes?.length || 0} Episodes
              </span>

              <span className="text-zinc-400">•</span>

              <span className="text-white">{series?.genre}</span>
            </div>

            {/* Content */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Left */}

              <div className="md:col-span-2">
                <p className="text-zinc-200 text-lg leading-8">
                  {series?.description}
                </p>
              </div>

              {/* Right */}

              <div className="space-y-5 text-sm md:text-base">
                <div>
                  <p className="text-zinc-500">Genre</p>
                  <p className="text-white">{series?.genre}</p>
                </div>

                <div>
                  <p className="text-zinc-500">Episodes</p>
                  <p className="text-white">{series?.episodes?.length || 0}</p>
                </div>

                <div>
                  <p className="text-zinc-500">Created</p>
                  <p className="text-white">
                    {series?.createdAt
                      ? new Date(series.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}

            <hr className="border-zinc-700 my-10" />

            {/* Episodes Header */}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Episodes</h2>

                <p className="text-zinc-400 mt-1">Season 1</p>
              </div>

              <div className="text-zinc-400 text-sm">
                {series?.episodes?.length || 0} Episodes
              </div>
            </div>
            <div className="space-y-2">
              {series?.episodes?.map((episode: any) => (
                <SeriesModalEpisodeCard
                  key={episode.id}
                  episode={episode}
                  seriesId={series.id}
                />
              ))}
            </div>
          </div>{" "}
          {/* End Content */}
        </div>{" "}
        {/* End bg-zinc-900 */}
      </div>{" "}
      {/* End max-w-6xl */}
    </div>
  );
};

export default SeriesInfoModal;
