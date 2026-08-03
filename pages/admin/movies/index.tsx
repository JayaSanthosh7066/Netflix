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

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error("Failed to load movies");
      }

      const data = await response.json();

      setMovies(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?\n\nThis action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete movie");
      }

      alert(data.message);

      fetchMovies();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Movies</h1>

        <Link href="/admin/movies/new">
          <button className="bg-red-600 px-5 py-3 rounded-lg hover:bg-red-700 transition">
            + Upload Memory
          </button>
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="text-center text-zinc-400 mt-20">
          <p className="text-xl">No Movies Uploaded Yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={movie.thumbnailUrl}
                alt={movie.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">{movie.title}</h2>

                <p className="text-gray-400 mt-2">{movie.genre}</p>

                <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                  {movie.description}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/admin/movies/${movie.id}/edit`)
                    }
                    className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="flex-1 bg-red-600 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
