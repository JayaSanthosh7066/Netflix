import React from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/movies/MovieList";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import useRecent from "@/hooks/useRecent";
import useSeriesList from "@/hooks/useSeriesList";
import SeriesInfoModal from "@/components/series/SeriesInfoModal";
import SeriesList from "@/components/series/SeriesList";

import useInfoModalStore from "@/hooks/useInfoModalStore";
import useSeriesInfoModalStore from "@/hooks/useSeriesInfoModalStore";
import InfoModal from "@/components/InfoModal";

import { useRouter } from "next/router";
import { useEffect } from "react";
import useImageSeriesList from "@/hooks/useImageSeriesList";
import ImageSeriesList from "@/components/image-series/ImageSeriesList";
import ImageSeriesInfoModal from "@/components/image-series/ImageSeriesInfoModal";
import useImageSeriesInfoModalStore from "@/hooks/useImageSeriesInfoModalStore";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Home = () => {
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const { data: recentMovies = [] } = useRecent();
  const { data: series = [] } = useSeriesList();

  const { isOpen, closeModal } = useInfoModalStore();

  const { data: imageSeries = [] } = useImageSeriesList();

  const router = useRouter();

  const {
    isOpen: isSeriesOpen,
    openModal: openSeriesModal,
    closeModal: closeSeriesModal,
  } = useSeriesInfoModalStore();

  const { isOpen: isImageSeriesOpen, closeModal: closeImageSeriesModal } =
    useImageSeriesInfoModalStore();

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.openSeriesModal !== "true") return;

    const seriesId = router.query.seriesId as string;

    if (!seriesId) return;

    openSeriesModal(seriesId);

    router.replace("/", undefined, { shallow: true });
  }, [
    router.isReady,
    router.query.openSeriesModal,
    router.query.seriesId,
    openSeriesModal,
  ]);

  return (
    <>
      <Navbar />

      <main className="bg-[#090909] overflow-x-hidden">
        {/* Hero */}
        <Billboard />

        {/* Content */}
        <section className="relative z-30 -mt-4 sm:-mt-6 md:-mt-8">
          <MovieList title="Trending Now" data={movies} />

          <ImageSeriesList title="Image Series" data={imageSeries} />

          <MovieList title="My List" data={favorites} />

          <MovieList title="Recently Added" data={recentMovies} />

          <SeriesList title="Series" data={series} />
        </section>
      </main>

      <InfoModal visible={isOpen} onClose={closeModal} />

      <SeriesInfoModal visible={isSeriesOpen} onClose={closeSeriesModal} />
      <ImageSeriesInfoModal
        visible={isImageSeriesOpen}
        onClose={closeImageSeriesModal}
      />
    </>
  );
};

export default Home;
