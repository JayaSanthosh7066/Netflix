import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PlayCircleIcon,
  HomeIcon,
  XMarkIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import { uploadFile } from "@/libs/uploadFile";

export default function ManageSeries() {
  const router = useRouter();

  const [series, setSeries] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any>(null);

  const [episodeNumber, setEpisodeNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const resetEpisodeForm = () => {
    setEditingEpisode(null);
    setEpisodeNumber("");
    setTitle("");
    setDescription("");
    setDuration("");
    setThumbnail(null);
    setVideo(null);
  };

  const closeModal = () => {
    if (loading) return;

    resetEpisodeForm();
    setIsModalOpen(false);
  };

  const openCreateEpisodeModal = () => {
    resetEpisodeForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchSeries();
  }, [router.isReady]);

  const fetchSeries = async () => {
    try {
      const response = await fetch(`/api/series/${router.query.seriesId}`);

      if (!response.ok) {
        throw new Error("Failed to load series.");
      }

      const data = await response.json();
      setSeries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditEpisode = async (episodeId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/episodes/${episodeId}`);

      if (!response.ok) {
        throw new Error("Failed to load episode.");
      }

      const episode = await response.json();

      setEditingEpisode(episode);
      setEpisodeNumber(String(episode.episodeNumber));
      setTitle(episode.title);
      setDescription(episode.description);
      setDuration(episode.duration);

      setThumbnail(null);
      setVideo(null);

      setIsModalOpen(true);
    } catch (error: any) {
      alert(error.message || "Failed to load episode.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEpisode = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !episodeNumber ||
      !duration.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!editingEpisode && (!thumbnail || !video)) {
      alert("Please select thumbnail and video.");
      return;
    }

    try {
      setLoading(true);

      let thumbnailUrl = editingEpisode?.thumbnailUrl || "";
      let videoUrl = editingEpisode?.videoUrl || "";

      if (thumbnail) {
        const uploaded = await uploadFile(thumbnail, "thumbnail");
        thumbnailUrl = uploaded.url;
      }

      if (video) {
        const uploaded = await uploadFile(video, "video");
        videoUrl = uploaded.url;
      }

      const endpoint = editingEpisode
        ? `/api/episodes/${editingEpisode.id}`
        : "/api/episodes";

      const method = editingEpisode ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration: duration.trim(),
          episodeNumber: Number(episodeNumber),
          thumbnailUrl,
          videoUrl,
          seriesId: series.id,
          showOnHome: editingEpisode?.showOnHome ?? false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save episode.");
      }

      alert(
        editingEpisode
          ? "Episode updated successfully!"
          : "Episode created successfully!",
      );

      closeModal();
      await fetchSeries();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this episode?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/episodes/${episodeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete episode.");
      }

      alert(data.message);

      await fetchSeries();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShowOnHome = async (episode: any) => {
    try {
      const response = await fetch(`/api/episodes/${episode.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showOnHome: !episode.showOnHome,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update.");
      }

      await fetchSeries();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!series) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18181b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-red-500" />
          <p className="text-sm text-zinc-400">Loading series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[400px]">
        <img
          src={series.bannerUrl || series.thumbnailUrl}
          alt={series.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-black/40 to-black/20" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-10">
            <div className="max-w-3xl">
              <span className="mb-3 inline-flex rounded-md bg-red-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {series.genre}
              </span>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {series.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* BACK */}
        <Link
          href="/admin/series"
          className="
            mb-7
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
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Series
        </Link>

        {/* ========================================================= */}
        {/* SERIES INFORMATION */}
        {/* ========================================================= */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            shadow-xl
          "
        >
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[240px_1fr]">
            {/* THUMBNAIL */}
            <div className="aspect-video bg-zinc-800 lg:aspect-auto">
              <img
                src={series.thumbnailUrl}
                alt={series.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* DETAILS */}
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Series Overview
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    {series.title}
                  </h2>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
                  <FilmIcon className="h-4 w-4 text-red-500" />
                  {series.episodes.length}{" "}
                  {series.episodes.length === 1 ? "Episode" : "Episodes"}
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                {series.description}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* EPISODES HEADER */}
        {/* ========================================================= */}

        <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Episodes
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Manage episodes and control their visibility.
            </p>
          </div>

          <button
            onClick={openCreateEpisodeModal}
            className="
              inline-flex
              min-h-[46px]
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-red-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              active:scale-[0.98]
              sm:w-auto
            "
          >
            <PlusIcon className="h-5 w-5" />
            Add Episode
          </button>
        </div>

        {/* ========================================================= */}
        {/* EPISODES */}
        {/* ========================================================= */}

        <div className="mt-6">
          {series.episodes.length === 0 ? (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-zinc-800
                bg-zinc-900
                px-5
                py-16
                text-center
              "
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
                <FilmIcon className="h-7 w-7 text-zinc-500" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-zinc-200">
                No Episodes Yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                Add your first episode to start building this series.
              </p>

              <button
                onClick={openCreateEpisodeModal}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  transition
                  hover:bg-red-700
                "
              >
                <PlusIcon className="h-4 w-4" />
                Add Episode
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {series.episodes.map((episode: any) => (
                <article
                  key={episode.id}
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    shadow-lg
                    transition
                    hover:border-zinc-700
                  "
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* EPISODE IMAGE */}
                    <div className="relative aspect-video w-full shrink-0 bg-zinc-800 sm:aspect-auto sm:h-auto sm:w-52 lg:w-60">
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.title}
                        className="h-full min-h-[150px] w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      <span
                        className="
                          absolute
                          bottom-3
                          left-3
                          rounded-md
                          bg-black/70
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                        "
                      >
                        EP {episode.episodeNumber}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-white sm:text-xl">
                              {episode.title}
                            </h3>

                            {episode.showOnHome && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                                <HomeIcon className="h-3 w-3" />
                                Home
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-zinc-500">
                            Episode {episode.episodeNumber} • {episode.duration}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                        {episode.description}
                      </p>

                      <div className="mt-5 flex flex-col gap-4 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* HOME TOGGLE */}
                        <label className="inline-flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={episode.showOnHome}
                            onChange={() => handleToggleShowOnHome(episode)}
                            className="peer sr-only"
                          />

                          <span
                            className="
                              relative
                              h-6
                              w-11
                              rounded-full
                              bg-zinc-700
                              transition
                              peer-checked:bg-red-600
                              after:absolute
                              after:left-[3px]
                              after:top-[3px]
                              after:h-[18px]
                              after:w-[18px]
                              after:rounded-full
                              after:bg-white
                              after:transition
                              peer-checked:after:translate-x-5
                            "
                          />

                          <span className="text-sm text-zinc-300">
                            Show on Home
                          </span>
                        </label>

                        {/* ACTIONS */}
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                          <button
                            onClick={() => handleEditEpisode(episode.id)}
                            className="
                              inline-flex
                              min-h-[42px]
                              items-center
                              justify-center
                              gap-2
                              rounded-lg
                              bg-blue-600
                              px-4
                              py-2
                              text-sm
                              font-medium
                              transition
                              hover:bg-blue-700
                            "
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteEpisode(episode.id)}
                            className="
                              inline-flex
                              min-h-[42px]
                              items-center
                              justify-center
                              gap-2
                              rounded-lg
                              bg-red-600/90
                              px-4
                              py-2
                              text-sm
                              font-medium
                              transition
                              hover:bg-red-700
                            "
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* ADD / EDIT EPISODE MODAL */}
      {/* ========================================================= */}

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
            {/* HEADER */}
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
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10">
                    <PlayCircleIcon className="h-5 w-5 text-red-500" />
                  </div>

                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    {editingEpisode ? "Edit Episode" : "Add Episode"}
                  </h2>
                </div>

                <p className="mt-2 text-sm text-zinc-500">
                  {editingEpisode
                    ? "Update episode information and media."
                    : "Add a new episode to this series."}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={loading}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-800
                  text-zinc-400
                  transition
                  hover:bg-zinc-700
                  hover:text-white
                  disabled:opacity-50
                "
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="max-h-[calc(100vh-160px)] overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              <div className="space-y-6">
                {/* BASIC INFO */}
                <div>
                  <h3 className="font-semibold text-white">
                    Episode Information
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Enter the details for this episode.
                  </p>
                </div>

                {/* EPISODE NUMBER + DURATION */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Episode Number
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 1"
                      value={episodeNumber}
                      onChange={(e) => setEpisodeNumber(e.target.value)}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-zinc-700
                        bg-zinc-800
                        px-4
                        py-3
                        text-white
                        outline-none
                        transition
                        placeholder:text-zinc-500
                        focus:border-red-500
                        focus:ring-2
                        focus:ring-red-500/20
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Duration
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 48 min"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-zinc-700
                        bg-zinc-800
                        px-4
                        py-3
                        text-white
                        outline-none
                        transition
                        placeholder:text-zinc-500
                        focus:border-red-500
                        focus:ring-2
                        focus:ring-red-500/20
                      "
                    />
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Episode Title
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter episode title"
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
                      outline-none
                      transition
                      placeholder:text-zinc-500
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
                    placeholder="Enter episode description"
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
                      outline-none
                      transition
                      placeholder:text-zinc-500
                      focus:border-red-500
                      focus:ring-2
                      focus:ring-red-500/20
                    "
                  />
                </div>

                {/* MEDIA */}
                <div className="border-t border-zinc-800 pt-6">
                  <h3 className="font-semibold text-white">Episode Media</h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {editingEpisode
                      ? "Leave a file empty to keep the existing media."
                      : "Upload the episode thumbnail and video."}
                  </p>
                </div>

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
                  {editingEpisode?.thumbnailUrl && !thumbnail && (
                    <div className="aspect-video overflow-hidden bg-zinc-800">
                      <img
                        src={editingEpisode.thumbnailUrl}
                        alt="Current episode thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {thumbnail && (
                    <div className="aspect-video overflow-hidden bg-zinc-800">
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="New episode thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Thumbnail
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setThumbnail(e.target.files?.[0] || null)
                      }
                      className="
                        block
                        w-full
                        cursor-pointer
                        rounded-lg
                        border
                        border-zinc-700
                        bg-zinc-800
                        text-sm
                        text-zinc-400
                        file:mr-4
                        file:border-0
                        file:bg-zinc-700
                        file:px-4
                        file:py-2.5
                        file:text-sm
                        file:font-medium
                        file:text-white
                        hover:file:bg-zinc-600
                      "
                    />
                  </div>
                </div>

                {/* VIDEO */}
                <div
                  className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-800/50
                    p-4
                  "
                >
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Video
                  </label>

                  {editingEpisode?.videoUrl && !video && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-zinc-800 p-3">
                      <PlayCircleIcon className="h-5 w-5 shrink-0 text-red-500" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200">
                          Existing video
                        </p>

                        <p className="truncate text-xs text-zinc-500">
                          Leave empty to keep the current video.
                        </p>
                      </div>
                    </div>
                  )}

                  {video && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-zinc-800 p-3">
                      <PlayCircleIcon className="h-5 w-5 shrink-0 text-emerald-500" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200">
                          New video selected
                        </p>

                        <p className="truncate text-xs text-zinc-500">
                          {video.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    className="
                      block
                      w-full
                      cursor-pointer
                      rounded-lg
                      border
                      border-zinc-700
                      bg-zinc-800
                      text-sm
                      text-zinc-400
                      file:mr-4
                      file:border-0
                      file:bg-zinc-700
                      file:px-4
                      file:py-2.5
                      file:text-sm
                      file:font-medium
                      file:text-white
                      hover:file:bg-zinc-600
                    "
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
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
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitEpisode}
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
                  {loading
                    ? editingEpisode
                      ? "Updating..."
                      : "Creating..."
                    : editingEpisode
                      ? "Update Episode"
                      : "Save Episode"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
