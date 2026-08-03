import Link from "next/link";
import { FilmIcon, TvIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-5xl font-bold">Content Dashboard</h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Create and manage your movies and series.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movies */}
          <Link href="/admin/movies">
            <div
              className="
                group
                cursor-pointer
                rounded-2xl
                bg-zinc-800
                p-8
                border
                border-zinc-700
                transition-all
                duration-300
                hover:bg-zinc-700
                hover:border-red-500
                hover:scale-[1.02]
                hover:shadow-2xl
              "
            >
              <FilmIcon className="w-16 h-16 text-red-500 mb-6 transition-transform duration-300 group-hover:scale-110" />

              <h2 className="text-3xl font-bold">Movies</h2>

              <p className="text-zinc-400 mt-3">
                Upload, edit and manage your movie library.
              </p>

              <div className="mt-10 flex items-center text-red-500 font-semibold">
                Open Movies
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Series */}
          <Link href="/admin/series">
            <div
              className="
                group
                cursor-pointer
                rounded-2xl
                bg-zinc-800
                p-8
                border
                border-zinc-700
                transition-all
                duration-300
                hover:bg-zinc-700
                hover:border-blue-500
                hover:scale-[1.02]
                hover:shadow-2xl
              "
            >
              <TvIcon className="w-16 h-16 text-blue-500 mb-6 transition-transform duration-300 group-hover:scale-110" />

              <h2 className="text-3xl font-bold">Series</h2>

              <p className="text-zinc-400 mt-3">
                Create series, manage episodes and organize content.
              </p>

              <div className="mt-10 flex items-center text-blue-500 font-semibold">
                Open Series
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
