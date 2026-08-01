import React from "react";

interface SeriesBannerProps {
  bannerUrl?: string;
  thumbnailUrl: string;
}

const SeriesBanner: React.FC<SeriesBannerProps> = ({
  bannerUrl,
  thumbnailUrl,
}) => {
  return (
    <div className="relative w-full h-[60vh]">
      <img
        src={bannerUrl || thumbnailUrl}
        alt="Series Banner"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
    </div>
  );
};

export default SeriesBanner;
