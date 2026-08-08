import React from "react";
import { isEmpty } from "lodash";

import { MovieInterface } from "@/types";
import MovieCard from "@/components/movies/MovieCard";

interface MovieListProps {
  data: MovieInterface[];
  title: string;
}

const MovieList: React.FC<MovieListProps> = ({ data, title }) => {
  if (isEmpty(data)) return null;

  return (
    <section className="mb-12">
      <div className="px-5 md:px-10 lg:px-14">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-5">
          {title}
        </h2>

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            pb-5
            scrollbar-hide
            snap-x
            snap-mandatory
          "
        >
          {data.map((movie) => (
            <div
              key={movie.id}
              className="
                flex-none
                w-[130px]
sm:w-[150px]
md:w-[180px]
lg:w-[215px]
                snap-start
              "
            >
              <MovieCard data={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieList;
