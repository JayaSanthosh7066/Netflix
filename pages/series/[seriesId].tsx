import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

import SeriesBanner from "@/components/series/SeriesBanner";
import SeriesInfo from "@/components/series/SeriesInfo";
import EpisodeList from "@/components/series/EpisodeList";

export default function SeriesPage() {
  const router = useRouter();

  const { seriesId } = router.query;

  const [series, setSeries] = useState<any>(null);

  useEffect(() => {
    if (!router.isReady) return;

    fetchSeries();
  }, [router.isReady]);

  const fetchSeries = async () => {
    try {
      const response = await fetch(`/api/series/${seriesId}`);

      if (!response.ok) {
        throw new Error("Failed to load series.");
      }

      const data = await response.json();

      setSeries(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!series) {
    return (
      <div className="min-h-screen bg-zinc-900 flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <SeriesBanner
        bannerUrl={series.bannerUrl}
        thumbnailUrl={series.thumbnailUrl}
      />

      <SeriesInfo
        title={series.title}
        genre={series.genre}
        description={series.description}
      />

      <EpisodeList episodes={series.episodes} seriesId={series.id} />
    </div>
  );
}
