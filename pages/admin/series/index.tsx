import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import ImagePicker from "@/components/ImagePicker";
import { uploadFile } from "@/libs/uploadFile";

interface Series {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  bannerUrl?: string;
}

export default function SeriesPage() {
  const router = useRouter();

  const [series, setSeries] = useState<Series[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await fetch("/api/series");

      if (!response.ok) {
        throw new Error("Failed to load series");
      }

      const data = await response.json();

      setSeries(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteSeries = async (seriesId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this series?\n\nThis will permanently delete:\n\n• The series\n• All episodes\n• All episode videos\n• All thumbnails\n• The series banner\n\nThis action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/series/${seriesId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete series");
      }

      alert(data.message);

      await fetchSeries();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    setEditingSeries(null);
    setTitle("");
    setDescription("");
    setGenre("");
    setThumbnail(null);
    setBanner(null);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditSeries = (series: Series) => {
    setEditingSeries(series);

    setTitle(series.title);
    setDescription(series.description);
    setGenre(series.genre);

    setThumbnail(null);
    setBanner(null);

    setIsModalOpen(true);
  };

  const handleUpdateSeries = async () => {
    if (!editingSeries) return;

    try {
      setLoading(true);

      if (!title.trim() || !description.trim() || !genre.trim()) {
        alert("Please fill all required fields.");
        return;
      }

      let thumbnailUrl = editingSeries.thumbnailUrl;
      let bannerUrl = editingSeries.bannerUrl;

      if (thumbnail) {
        const response = await uploadFile(thumbnail, "thumbnail");
        thumbnailUrl = response.url;
      }

      if (banner) {
        const response = await uploadFile(banner, "banner");
        bannerUrl = response.url;
      }

      const response = await fetch(`/api/series/${editingSeries.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          genre,
          thumbnailUrl,
          bannerUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update series");
      }

      alert(data.message);

      closeModal();

      await fetchSeries();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      {/* HEADER */}
      <header className="mb-10">
        {/* BACK BUTTON */}
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

        {/* TITLE + CREATE */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Series
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Manage your series and episodes
            </p>
          </div>

          <Link href="/admin/series/new" className="w-full sm:w-auto">
            <button
              className="
                flex
                w-full
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
                active:scale-[0.98]
                sm:w-auto
              "
            >
              <PlusIcon className="h-5 w-5" />
              Create Series
            </button>
          </Link>
        </div>
      </header>

      {/* SERIES */}
      {series.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-zinc-300">
              No Series Created Yet
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Create your first series to get started.
            </p>
          </div>
        </div>
      ) : (
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
          {series.map((item) => (
            <div
              key={item.id}
              className="
                group
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-zinc-700
                hover:shadow-2xl
              "
            >
              {/* IMAGE */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                {/* IMAGE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* GENRE */}
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
                    text-emerald-400
                    backdrop-blur-sm
                  "
                >
                  {item.genre}
                </span>
              </div>

              {/* CONTENT */}
              <div className="flex min-h-[235px] flex-col p-5">
                <h2 className="line-clamp-1 text-xl font-bold text-white">
                  {item.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>

                {/* ACTIONS */}
                <div className="mt-auto grid grid-cols-3 gap-2 pt-6">
                  <button
                    onClick={() => router.push(`/admin/series/${item.id}`)}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-zinc-800
                      px-2
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-zinc-700
                    "
                  >
                    <Cog6ToothIcon className="h-4 w-4" />
                    <span>Manage</span>
                  </button>

                  <button
                    onClick={() => handleEditSeries(item)}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-blue-600
                      px-2
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-blue-700
                    "
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSeries(item.id)}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-red-600
                      px-2
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-red-700
                    "
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {/* EDIT MODAL */}
      {isModalOpen && (
        <div
          className="
      fixed
      inset-0
      z-50
      overflow-y-auto
      bg-black/80
      px-4
      py-6
      backdrop-blur-sm
      sm:flex
      sm:items-center
      sm:justify-center
      sm:py-8
    "
        >
          <div
            className="
        mx-auto
        w-full
        max-w-2xl
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        shadow-2xl
      "
          >
            {/* MODAL HEADER */}
            <div
              className="
          flex
          items-start
          justify-between
          border-b
          border-zinc-800
          px-5
          py-5
          sm:px-7
          sm:py-6
        "
            >
              <div className="pr-4">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Edit Series
                </h2>

                <p className="mt-1.5 text-sm text-zinc-500">
                  Update your series details and artwork.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                aria-label="Close"
                className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-zinc-800
            text-lg
            text-zinc-400
            transition
            hover:bg-zinc-700
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
              >
                ✕
              </button>
            </div>

            {/* FORM CONTENT */}
            <div
              className="
          max-h-[calc(100vh-150px)]
          overflow-y-auto
          px-5
          py-6
          sm:px-7
          sm:py-7
        "
            >
              <div className="space-y-6">
                {/* SERIES INFORMATION */}
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Series Information
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Update the basic information shown for this series.
                  </p>
                </div>

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Series Title
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter series title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                w-full
                rounded-lg
                border
                border-zinc-700
                bg-zinc-800
                px-4
                py-3
                text-white
                placeholder-zinc-500
                outline-none
                transition
                focus:border-red-500
                focus:ring-2
                focus:ring-red-500/20
              "
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Description
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    placeholder="Enter series description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="
                w-full
                resize-none
                rounded-lg
                border
                border-zinc-700
                bg-zinc-800
                px-4
                py-3
                text-white
                placeholder-zinc-500
                outline-none
                transition
                focus:border-red-500
                focus:ring-2
                focus:ring-red-500/20
              "
                  />
                </div>

                {/* GENRE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Genre
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Travel, Birthday, Family"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="
                w-full
                rounded-lg
                border
                border-zinc-700
                bg-zinc-800
                px-4
                py-3
                text-white
                placeholder-zinc-500
                outline-none
                transition
                focus:border-red-500
                focus:ring-2
                focus:ring-red-500/20
              "
                  />
                </div>

                {/* MEDIA SECTION */}
                <div className="border-t border-zinc-800 pt-6">
                  <h3 className="text-base font-semibold text-white">
                    Series Artwork
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Keep the existing artwork or select new images.
                  </p>
                </div>

                {/* THUMBNAIL + BANNER */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* THUMBNAIL */}
                  <div
                    className="
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-zinc-800/50
              "
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-800">
                      {thumbnail ? (
                        <img
                          src={URL.createObjectURL(thumbnail)}
                          alt="New thumbnail preview"
                          className="h-full w-full object-cover"
                        />
                      ) : editingSeries?.thumbnailUrl ? (
                        <img
                          src={editingSeries.thumbnailUrl}
                          alt="Current thumbnail"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                          No thumbnail
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-medium text-zinc-200">
                        Thumbnail
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Main image displayed for your series.
                      </p>

                      <div className="mt-4">
                        <ImagePicker
                          label={
                            thumbnail
                              ? "Choose Different Thumbnail"
                              : "Change Thumbnail"
                          }
                          file={thumbnail}
                          setFile={setThumbnail}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BANNER */}
                  <div
                    className="
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-zinc-800/50
              "
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-800">
                      {banner ? (
                        <img
                          src={URL.createObjectURL(banner)}
                          alt="New banner preview"
                          className="h-full w-full object-cover"
                        />
                      ) : editingSeries?.bannerUrl ? (
                        <img
                          src={editingSeries.bannerUrl}
                          alt="Current banner"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                          No banner
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-medium text-zinc-200">
                        Banner
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Artwork used for the series banner.
                      </p>

                      <div className="mt-4">
                        <ImagePicker
                          label={
                            banner ? "Choose Different Banner" : "Change Banner"
                          }
                          file={banner}
                          setFile={setBanner}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div
              className="
          border-t
          border-zinc-800
          bg-zinc-900
          px-5
          py-4
          sm:px-7
        "
            >
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="
              min-h-[48px]
              rounded-lg
              bg-zinc-800
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-zinc-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateSeries}
                  disabled={loading}
                  className="
              min-h-[48px]
              rounded-lg
              bg-red-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:bg-zinc-700
              disabled:text-zinc-400
            "
                >
                  {loading ? "Updating..." : "Update Series"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
