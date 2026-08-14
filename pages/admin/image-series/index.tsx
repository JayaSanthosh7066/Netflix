import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface ImageSeries {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  _count?: {
    images: number;
  };
}

export default function ImageSeriesPage() {
  const router = useRouter();

  const [imageSeries, setImageSeries] = useState<ImageSeries[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImageSeries();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image series? All images inside it will also be deleted.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`/api/image-series/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image series");
      }

      setImageSeries((current) => current.filter((series) => series.id !== id));
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete image series");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchImageSeries = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/image-series");

      if (!response.ok) {
        throw new Error("Failed to load image series");
      }

      const data = await response.json();

      setImageSeries(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      {/* HEADER */}
      <header className="mb-10">
        <button
          onClick={() => router.push("/admin")}
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-zinc-400
            transition
            hover:text-white
          "
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Image Series
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Manage your image collections and photos
            </p>
          </div>

          <Link href="/admin/image-series/new">
            <span
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-red-600
                px-5
                py-3
                font-semibold
                transition
                hover:bg-red-700
              "
            >
              <PlusIcon className="h-5 w-5" />
              Create Image Series
            </span>
          </Link>
        </div>
      </header>

      {/* LOADING */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-zinc-500">Loading image series...</p>
        </div>
      ) : imageSeries.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-zinc-700" />

            <p className="mt-4 text-xl font-semibold text-zinc-300">
              No Image Series Created Yet
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Create your first image series to get started.
            </p>
          </div>
        </div>
      ) : (
        /* SERIES GRID */
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
          {imageSeries.map((item) => (
            <div
              key={item.id}
              className="
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                shadow-lg
              "
            >
              {/* COVER */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <span
                  className="
                    absolute
                    bottom-3
                    left-3
                    rounded-md
                    bg-black/60
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-white
                    backdrop-blur-sm
                  "
                >
                  {item._count?.images ?? 0}{" "}
                  {item._count?.images === 1 ? "image" : "images"}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h2 className="line-clamp-1 text-xl font-bold">{item.title}</h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/admin/image-series/${item.id}`)
                    }
                    className="
      flex-1
      rounded-lg
      bg-zinc-800
      px-4
      py-3
      text-sm
      font-medium
      transition
      hover:bg-zinc-700
    "
                  >
                    Manage Images
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="
      flex
      items-center
      justify-center
      rounded-lg
      bg-zinc-800
      px-4
      py-3
      text-zinc-400
      transition
      hover:bg-red-600
      hover:text-white
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
                    aria-label="Delete image series"
                  >
                    <TrashIcon className="h-5 w-5" />
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
