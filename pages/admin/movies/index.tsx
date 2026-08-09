import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
}

export default function MoviesPage() {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error("Failed to load movies");
      }

      const data = await response.json();

      setMovies(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?\n\nThis action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(movieId);

      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete movie");
      }

      alert(data.message);

      await fetchMovies();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      {/* HEADER */}
      <header className="mx-auto w-full max-w-7xl">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="
            mb-6
            inline-flex
            min-h-[44px]
            items-center
            gap-2
            text-sm
            font-medium
            text-zinc-400
            transition
            hover:text-white
          "
        >
          <span className="text-xl leading-none">←</span>
          Back
        </button>

        {/* TITLE + CREATE BUTTON */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Movies
            </h1>

            <p className="mt-2 text-sm text-zinc-500 sm:text-base">
              Manage your uploaded movies and memories.
            </p>
          </div>

          <Link
            href="/admin/movies/new"
            className="
              inline-flex
              min-h-[48px]
              w-full
              items-center
              justify-center
              rounded-lg
              bg-red-600
              px-5
              py-3
              font-semibold
              transition
              hover:bg-red-700
              active:scale-[0.98]
              sm:w-auto
            "
          >
            + Upload Memory
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto w-full max-w-7xl">
        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-zinc-700
                  border-t-red-600
                "
              />

              <p className="text-sm text-zinc-500">Loading movies...</p>
            </div>
          </div>
        ) : movies.length === 0 ? (
          /* EMPTY STATE */
          <div
            className="
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-zinc-800
              bg-zinc-900
              px-6
              text-center
            "
          >
            <div
              className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-zinc-800
                text-3xl
              "
            >
              🎬
            </div>

            <h2 className="text-xl font-semibold">No Movies Uploaded Yet</h2>

            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Start building your movie collection by uploading your first
              memory.
            </p>

            <Link
              href="/admin/movies/new"
              className="
                mt-6
                inline-flex
                min-h-[46px]
                items-center
                justify-center
                rounded-lg
                bg-red-600
                px-6
                py-3
                font-medium
                transition
                hover:bg-red-700
              "
            >
              + Upload Your First Memory
            </Link>
          </div>
        ) : (
          /* MOVIE GRID */
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="
                  group
                  flex
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  shadow-lg
                  transition
                  hover:-translate-y-1
                  hover:border-zinc-700
                "
              >
                {/* THUMBNAIL */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  <img
                    src={movie.thumbnailUrl}
                    alt={movie.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />

                  {/* GENRE BADGE */}
                  <div
                    className="
                      absolute
                      left-3
                      top-3
                      rounded-full
                      bg-black/70
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    {movie.genre}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-1 text-xl font-bold">
                    {movie.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {movie.description}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-auto flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/admin/movies/${movie.id}/edit`)
                      }
                      disabled={deletingId === movie.id}
                      className="
                        min-h-[44px]
                        flex-1
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMovie(movie.id)}
                      disabled={deletingId === movie.id}
                      className="
                        min-h-[44px]
                        flex-1
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:bg-zinc-700
                        disabled:text-zinc-400
                      "
                    >
                      {deletingId === movie.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
