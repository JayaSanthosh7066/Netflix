import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { uploadFile } from "@/libs/uploadFile";

export default function AdminPage() {
  const router = useRouter();
  const { movieId } = router.query;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    fetchMovie();
  }, [router.isReady]);

  const fetchMovie = async () => {
    try {
      setFetching(true);

      const response = await fetch(`/api/movies/${movieId}`);

      if (!response.ok) {
        throw new Error("Failed to load movie");
      }

      const movie = await response.json();

      setTitle(movie.title);
      setDescription(movie.description);
      setGenre(movie.genre);
      setDuration(movie.duration);

      setThumbnailUrl(movie.thumbnailUrl);
      setVideoUrl(movie.videoUrl);

      setThumbnail(null);
      setVideo(null);

      setThumbnailPreview(movie.thumbnailUrl);
      setVideoPreview(movie.videoUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideo(file);

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        alert("Please enter a title");
        return;
      }

      if (!description.trim()) {
        alert("Please enter a description");
        return;
      }

      if (!genre) {
        alert("Please select a genre");
        return;
      }

      if (!duration.trim()) {
        alert("Please enter the duration");
        return;
      }

      setLoading(true);

      let updatedThumbnailUrl = thumbnailUrl;
      let updatedVideoUrl = videoUrl;

      // Upload new thumbnail only if selected
      if (thumbnail) {
        const thumbnailResponse = await uploadFile(thumbnail, "thumbnail");

        updatedThumbnailUrl = thumbnailResponse.url;
      }

      // Upload new video only if selected
      if (video) {
        const videoResponse = await uploadFile(video, "video");

        updatedVideoUrl = videoResponse.url;
      }

      const response = await fetch(`/api/movies/${movieId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          genre,
          duration,
          thumbnailUrl: updatedThumbnailUrl,
          videoUrl: updatedVideoUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update movie.");
      }

      alert("Movie updated successfully!");

      router.push("/admin/movies");
    } catch (error: any) {
      alert(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#18181b] text-white flex items-center justify-center">
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

          <p className="text-sm text-zinc-500">Loading movie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => router.push("/admin/movies")}
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
          Back to Movies
        </button>

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Edit Memory
          </h1>

          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Update your movie details and media.
          </p>
        </div>

        {/* FORM CARD */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            shadow-xl
          "
        >
          {/* CARD HEADER */}

          <div className="border-b border-zinc-800 px-5 py-5 sm:px-8">
            <h2 className="text-xl font-semibold">Movie Details</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the information associated with this memory.
            </p>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            {/* TITLE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Video Title
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter video title..."
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
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                rows={5}
                placeholder="Video description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

            {/* GENRE + DURATION */}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* GENRE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Genre
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
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
                    outline-none
                    transition
                    focus:border-red-500
                    focus:ring-2
                    focus:ring-red-500/20
                  "
                >
                  <option value="">Choose Genre</option>
                  <option value="Travel">Travel</option>
                  <option value="Family">Family</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Music">Music</option>
                  <option value="Education">Education</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              {/* DURATION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Duration
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 15 min"
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
            </div>

            {/* MEDIA DIVIDER */}

            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold">Media Files</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Preview the current media or select new files to replace them.
              </p>
            </div>

            {/* MEDIA */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* THUMBNAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Thumbnail
                </label>

                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-800/50
                  "
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="
                        aspect-video
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-sm text-zinc-500">
                      No thumbnail
                    </div>
                  )}

                  <div className="p-4">
                    <label
                      className="
                        flex
                        min-h-[44px]
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        bg-zinc-700
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-zinc-600
                      "
                    >
                      {thumbnail
                        ? "Choose Different Thumbnail"
                        : "Choose Thumbnail"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>

                    {thumbnail && (
                      <p className="mt-2 truncate text-xs text-zinc-500">
                        {thumbnail.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* VIDEO */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Video
                </label>

                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-800/50
                  "
                >
                  {videoPreview ? (
                    <video
                      src={videoPreview}
                      controls
                      className="
                        aspect-video
                        w-full
                        bg-black
                        object-contain
                      "
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-sm text-zinc-500">
                      No video
                    </div>
                  )}

                  <div className="p-4">
                    <label
                      className="
                        flex
                        min-h-[44px]
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        bg-zinc-700
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-zinc-600
                      "
                    >
                      {video ? "Choose Different Video" : "Choose Video"}

                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>

                    {video && (
                      <p className="mt-2 truncate text-xs text-zinc-500">
                        {video.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="border-t border-zinc-800 pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/admin/movies")}
                  disabled={loading}
                  className="
                    min-h-[48px]
                    rounded-lg
                    bg-zinc-800
                    px-6
                    py-3
                    font-medium
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
                  onClick={handleSubmit}
                  disabled={loading}
                  className="
                    min-h-[48px]
                    rounded-lg
                    bg-red-600
                    px-7
                    py-3
                    font-semibold
                    transition
                    hover:bg-red-700
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:bg-zinc-700
                    disabled:text-zinc-400
                  "
                >
                  {loading ? "Updating..." : "Update Memory"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
