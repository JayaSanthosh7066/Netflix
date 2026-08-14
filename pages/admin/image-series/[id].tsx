import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import { uploadFile } from "@/libs/uploadFile";

interface ImageItem {
  id: string;
  title: string | null;
  imageUrl: string;
  imageNumber: number;
}

interface ImageSeries {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export default function ManageImageSeriesPage() {
  const router = useRouter();

  const { id } = router.query;

  const [imageSeries, setImageSeries] = useState<ImageSeries | null>(null);

  const [images, setImages] = useState<ImageItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    fetchImageSeries();
  }, [id]);

  const fetchImageSeries = async () => {
    if (typeof id !== "string") return;

    try {
      setLoading(true);

      const [seriesResponse, imagesResponse] = await Promise.all([
        fetch(`/api/image-series/${id}`),
        fetch(`/api/image-series/${id}/images`),
      ]);

      const seriesData = await seriesResponse.json();
      const imagesData = await imagesResponse.json();

      if (!seriesResponse.ok) {
        throw new Error(seriesData.error || "Failed to load image series");
      }

      if (!imagesResponse.ok) {
        throw new Error(imagesData.error || "Failed to load images");
      }

      setImageSeries(seriesData);
      setImages(imagesData.images || imagesData);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (typeof id !== "string") return;

    try {
      setUploading(true);

      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Upload image
        const uploadResponse = await uploadFile(file, "image", id);

        // Add image to the series
        const response = await fetch(`/api/image-series/${id}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: uploadResponse.url,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to add ${file.name}`);
        }

        setImages((current) => [...current, data]);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);

      // Reset file input
      event.target.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    if (typeof id !== "string") return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(imageId);

      const response = await fetch(
        `/api/image-series/${id}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image");
      }

      setImages((current) => current.filter((image) => image.id !== imageId));
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18181b] text-white">
        <p className="text-zinc-500">Loading image series...</p>
      </div>
    );
  }

  if (!imageSeries) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18181b] text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">Image Series not found</p>

          <button
            onClick={() => router.push("/admin/image-series")}
            className="mt-4 rounded-lg bg-zinc-800 px-5 py-3 text-sm font-medium hover:bg-zinc-700"
          >
            Back to Image Series
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      {/* HEADER */}
      <header className="mb-8">
        <button
          onClick={() => router.push("/admin/image-series")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Image Series
        </button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {imageSeries.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              {imageSeries.description}
            </p>
          </div>

          {/* ADD IMAGES */}
          <label
            className={`
              inline-flex
              cursor-pointer
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
              ${uploading ? "cursor-not-allowed opacity-60" : ""}
            `}
          >
            <ArrowUpTrayIcon className="h-5 w-5" />

            {uploading ? "Uploading..." : "Add Images"}

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleFilesSelected}
              className="hidden"
            />
          </label>
        </div>
      </header>

      {/* SERIES INFO */}
      <section
        className="
          mb-10
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
        "
      >
        <div className="grid md:grid-cols-[280px_1fr]">
          {/* COVER */}
          <div className="aspect-video md:aspect-auto">
            <img
              src={imageSeries.thumbnailUrl}
              alt={imageSeries.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Image Series
            </p>

            <h2 className="mt-2 text-2xl font-bold">{imageSeries.title}</h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {imageSeries.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
              <PhotoIcon className="h-5 w-5" />
              {images.length} {images.length === 1 ? "image" : "images"}
            </div>
          </div>
        </div>
      </section>

      {/* IMAGES */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Images</h2>

            <p className="mt-1 text-sm text-zinc-500">
              These images will appear inside this series.
            </p>
          </div>
        </div>

        {images.length === 0 ? (
          <div
            className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-zinc-800
              bg-zinc-900/50
              px-6
              text-center
            "
          >
            <PhotoIcon className="h-14 w-14 text-zinc-700" />

            <h3 className="mt-5 text-lg font-semibold text-zinc-300">
              No images yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Click &quot;Add Images&quot; above to upload the photos for this
              series.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="
                  group
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                "
              >
                {/* IMAGE */}
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                  <img
                    src={image.imageUrl}
                    alt={image.title || `Image ${image.imageNumber}`}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />

                  {/* NUMBER */}
                  <div
                    className="
                      absolute
                      left-3
                      top-3
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-black/70
                      px-2
                      text-xs
                      font-bold
                      backdrop-blur-sm
                    "
                  >
                    {String(image.imageNumber).padStart(2, "0")}
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id}
                    className="
                      absolute
                      right-3
                      top-3
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-black/70
                      text-white
                      opacity-100
                      backdrop-blur-sm
                      transition
                      hover:bg-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:opacity-0
                      sm:group-hover:opacity-100
                    "
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* FOOTER */}
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-zinc-300">
                    {image.title || `Image ${image.imageNumber}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
