import Link from "next/link";
import {
  ArrowLeftIcon,
  FilmIcon,
  PhotoIcon,
  TvIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Back Button */}
        <Link
          href="/"
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-zinc-800
            px-4
            py-2.5
            text-sm
            font-medium
            text-zinc-200
            transition
            hover:bg-zinc-700
            hover:text-white
          "
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Content Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Create and manage your movies and series.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          {/* Movies */}
          <Link href="/admin/movies" className="block">
            <div
              className="
                group
                h-full
                cursor-pointer
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-800
                p-6
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:border-red-500
                hover:bg-zinc-700
                hover:shadow-2xl
                sm:p-8
              "
            >
              <FilmIcon
                className="
                  mb-5
                  h-12
                  w-12
                  text-red-500
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  sm:h-16
                  sm:w-16
                "
              />

              <h2 className="text-2xl font-bold sm:text-3xl">Movies</h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
                Upload, edit and manage your movie library.
              </p>

              <div className="mt-8 flex items-center font-semibold text-red-500 sm:mt-10">
                Open Movies
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Series */}
          <Link href="/admin/series" className="block">
            <div
              className="
                group
                h-full
                cursor-pointer
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-800
                p-6
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:border-blue-500
                hover:bg-zinc-700
                hover:shadow-2xl
                sm:p-8
              "
            >
              <TvIcon
                className="
                  mb-5
                  h-12
                  w-12
                  text-blue-500
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  sm:h-16
                  sm:w-16
                "
              />

              <h2 className="text-2xl font-bold sm:text-3xl">Series</h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
                Create series, manage episodes and organize content.
              </p>

              <div className="mt-8 flex items-center font-semibold text-blue-500 sm:mt-10">
                Open Series
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Image Series */}
          <Link href="/admin/image-series" className="block">
            <div
              className="
      group
      h-full
      cursor-pointer
      rounded-2xl
      border
      border-zinc-700
      bg-zinc-800
      p-6
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:border-emerald-500
      hover:bg-zinc-700
      hover:shadow-2xl
      sm:p-8
    "
            >
              <PhotoIcon
                className="
        mb-5
        h-12
        w-12
        text-emerald-500
        transition-transform
        duration-300
        group-hover:scale-110
        sm:h-16
        sm:w-16
      "
              />

              <h2 className="text-2xl font-bold sm:text-3xl">Image Series</h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
                Create image collections and manage their photos.
              </p>

              <div className="mt-8 flex items-center font-semibold text-emerald-500 sm:mt-10">
                Open Image Series
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
