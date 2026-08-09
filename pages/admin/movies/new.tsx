import { useState } from "react";
import { useRouter } from "next/router";
import { uploadFile } from "@/libs/uploadFile";

export default function AdminPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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

    if (!video) {
      alert("Please select a video");
      return;
    }

    if (!thumbnail) {
      alert("Please select a thumbnail");
      return;
    }

    try {
      setLoading(true);

      // Upload video first
      const videoResponse = await uploadFile(video, "video");

      console.log("Video:", videoResponse);

      // Upload thumbnail
      const thumbnailResponse = await uploadFile(thumbnail, "thumbnail");

      console.log("Thumbnail:", thumbnailResponse);

      // Save movie
      const response = await fetch("/api/movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          genre,
          duration,
          videoUrl: videoResponse.url,
          thumbnailUrl: thumbnailResponse.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload movie");
      }

      await response.json();

      alert("Movie uploaded successfully!");

      router.push("/admin/movies");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

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
            Add a Memory
          </h1>

          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Upload a video and add the details needed to create your movie.
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
            <h2 className="text-xl font-semibold">Upload a Video</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Fill in the information below before uploading.
            </p>
          </div>

          {/* FORM */}
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
                placeholder="Write a short description about this memory..."
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

            {/* DIVIDER */}
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold">Media Files</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Add the thumbnail and video for this memory.
              </p>
            </div>

            {/* FILE UPLOADS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* THUMBNAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Thumbnail
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <label
                  className="
                    flex
                    min-h-[150px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-zinc-700
                    bg-zinc-800/50
                    px-4
                    text-center
                    transition
                    hover:border-red-500
                    hover:bg-zinc-800
                  "
                >
                  <div className="mb-3 text-3xl">🖼️</div>

                  <p className="text-sm font-medium text-zinc-200">
                    {thumbnail ? thumbnail.name : "Choose thumbnail"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">PNG, JPG, JPEG</p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnail(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                  />
                </label>
              </div>

              {/* VIDEO */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  Video
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <label
                  className="
                    flex
                    min-h-[150px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-zinc-700
                    bg-zinc-800/50
                    px-4
                    text-center
                    transition
                    hover:border-red-500
                    hover:bg-zinc-800
                  "
                >
                  <div className="mb-3 text-3xl">🎬</div>

                  <p className="max-w-full truncate px-2 text-sm font-medium text-zinc-200">
                    {video ? video.name : "Choose video"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">MP4, MOV, WebM</p>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setVideo(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* UPLOAD BUTTON */}
            <div className="border-t border-zinc-800 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="
                  flex
                  min-h-[52px]
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-600
                  px-6
                  py-3
                  text-base
                  font-semibold
                  transition
                  hover:bg-red-700
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:bg-zinc-700
                  disabled:text-zinc-400
                "
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-zinc-500
                        border-t-white
                      "
                    />
                    Uploading...
                  </span>
                ) : (
                  "Upload Video"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
