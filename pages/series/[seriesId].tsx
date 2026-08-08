import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

import SeriesFavoriteButton from "@/components/series/SeriesFavoriteButton";
import SeriesModalEpisodeCard from "@/components/series/SeriesModalEpisodeCard";
import MobileEpisodeCard from "@/components/series/MobileEpisodeCard";

export default function SeriesPage() {
  const router = useRouter();
  const { seriesId } = router.query;

  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !seriesId) return;

    const fetchSeries = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/series/${seriesId}`);

        if (!response.ok) {
          throw new Error("Failed to load series.");
        }

        const data = await response.json();

        setSeries(data);
      } catch (error) {
        console.error("Failed to load series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [router.isReady, seriesId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </main>
    );
  }

  if (!series) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Series not found.</p>
      </main>
    );
  }

  const episodes = series.episodes || [];
  const firstEpisode = episodes[0];

  const handlePlay = () => {
    if (!firstEpisode) return;

    router.push(`/watch/${firstEpisode.id}?type=episode&seriesId=${series.id}`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: series.title,
          text: series.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pb-10">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative">
        {/* Back button */}

        <button
          onClick={() => router.back()}
          className="
            absolute
            top-5
            left-4
            z-30
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-black/40
            backdrop-blur-sm
          "
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </button>

        {/* Banner */}

        <div className="relative h-[48vh] min-h-[300px]">
          <img
            src={series.bannerUrl || series.thumbnailUrl}
            alt={series.title}
            className="
              h-full
              w-full
              object-cover
            "
          />

          {/* Top dark gradient */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-black/40
              via-transparent
              to-transparent
            "
          />

          {/* Bottom gradient */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[55%]
              bg-gradient-to-t
              from-black
              via-black/60
              to-transparent
            "
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* MAIN INFORMATION */}
      {/* ================================================= */}

      <section className="relative -mt-2 px-5">
        {/* TITLE */}

        <h1
          className="
            text-[34px]
            font-bold
            leading-[1.05]
            tracking-tight
          "
        >
          {series.title}
        </h1>

        {/* META */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-3
            text-sm
            text-zinc-300
          "
        >
          <span className="text-zinc-300">{series.genre}</span>

          <span className="text-zinc-600">•</span>

          <span>{episodes.length} Episodes</span>
        </div>

        <p
          className="
    mt-6
    text-base
    leading-6
    text-zinc-300
    line-clamp-3
  "
        >
          {series.description}
        </p>

        {/* PLAY */}

        <button
          onClick={handlePlay}
          disabled={!firstEpisode}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-md
            bg-white
            py-4
            text-lg
            font-semibold
            text-black
            transition
            active:scale-[0.98]
            disabled:opacity-50
          "
        >
          <PlayIcon className="h-6 w-6 fill-black" />
          Play
        </button>

        {/* ================================================= */}
        {/* FEATURED EPISODE */}
        {/* ================================================= */}

        {firstEpisode && (
          <div className="mt-9">
            <h3
              className="
                text-lg
                font-bold
                leading-6
                line-clamp-2
              "
            >
              Episode {firstEpisode.episodeNumber}: {firstEpisode.title}
            </h3>

            <p
              className="
                mt-4
                text-[16px]
                leading-6
                text-zinc-300
                line-clamp-5
              "
            >
              {firstEpisode.description}
            </p>
          </div>
        )}

        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div
          className="
            mt-8
            flex
            items-start
            justify-around
          "
        >
          {/* MY LIST */}

          <div className="flex flex-col items-center gap-2">
            <SeriesFavoriteButton seriesId={series.id} />

            <span className="text-xs text-zinc-400">My List</span>
          </div>

          {/* SHARE */}

          <button
            onClick={handleShare}
            className="
              flex
              flex-col
              items-center
              gap-2
              text-zinc-200
            "
          >
            <ShareIcon className="h-7 w-7" />

            <span className="text-xs text-zinc-400">Share</span>
          </button>
        </div>
      </section>

      {/* ================================================= */}
      {/* EPISODES */}
      {/* ================================================= */}

      <section className="mt-10">
        {/* Tabs */}

        <div
          className="
            border-b
            border-zinc-800
            px-5
          "
        >
          <div className="relative inline-block pb-4">
            <h2 className="text-lg font-bold">Episodes</h2>

            <div
              className="
                absolute
                bottom-0
                left-0
                h-[3px]
                w-full
                bg-red-600
              "
            />
          </div>
        </div>

        {/* Season */}

        <div className="px-5 pt-7">
          <h3 className="text-xl font-bold">Season 1</h3>

          <p className="mt-1 text-sm text-zinc-500">
            {episodes.length} Episodes
          </p>
        </div>

        {/* Episode list */}

        <div className="mt-4">
          {episodes.map((episode: any) => (
            <MobileEpisodeCard
              key={episode.id}
              episode={episode}
              seriesId={series.id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
