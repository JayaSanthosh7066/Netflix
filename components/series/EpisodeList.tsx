import React from "react";

import EpisodeCard from "@/components/series/EpisodeCard";

interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  seriesId: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, seriesId }) => {
  return (
    <div className="max-w-6xl mx-auto px-8 mt-16 mb-20">
      <h2 className="text-3xl font-bold text-white mb-8">Episodes</h2>

      {episodes.length === 0 ? (
        <div className="text-zinc-400">No Episodes Available</div>
      ) : (
        <div className="space-y-4">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              seriesId={seriesId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodeList;
