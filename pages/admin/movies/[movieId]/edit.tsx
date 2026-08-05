import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { uploadFile } from "@/libs/uploadFile";

export default function AdminPage() {
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
  const router = useRouter();
  const { movieId } = router.query;

  //   const handleSubmit = () => {
  //     console.log({
  //       title,
  //       description,
  //       genre,
  //       duration,
  //       thumbnail,
  //       video,
  //     });
  //   };

  const handleSubmit = async () => {
    try {
      let updatedThumbnailUrl = thumbnailUrl;
      let updatedVideoUrl = videoUrl;

      // Upload new thumbnail if selected
      if (thumbnail) {
        const thumbnailResponse = await uploadFile(thumbnail, "thumbnail");
        updatedThumbnailUrl = thumbnailResponse.url;
      }

      // Upload new video if selected
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
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    fetchMovie();
  }, [router.isReady]);

  const fetchMovie = async () => {
    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold text-red-600">Edit Memory</h1>

            <p className="text-zinc-400 mt-2">
              Update your movie details and media.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/movies")}
            className="bg-zinc-700 hover:bg-zinc-600 px-5 py-3 rounded-lg transition"
          >
            ← Back to Movies
          </button>
        </div>

        <div className="bg-zinc-800 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Movie Details</h2>

          {/* Title */}

          <div className="mb-5">
            <label className="block mb-2">Video Title</label>

            <input
              type="text"
              placeholder="Enter video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-zinc-700 p-3 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}

          <div className="mb-5">
            <label className="block mb-2">Description</label>

            <textarea
              rows={4}
              placeholder="Video description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-zinc-700 p-3 outline-none resize-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Genre + Duration */}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Genre</label>

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-lg bg-zinc-700 p-3"
              >
                <option value="">Choose Genre</option>
                <option>Travel</option>
                <option>Family</option>
                <option>Adventure</option>
                <option>Music</option>
                <option>Education</option>
                <option>Personal</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Duration</label>

              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="15 min"
                className="w-full rounded-lg bg-zinc-700 p-3"
              />
            </div>
          </div>

          {/* Thumbnail */}

          <div className="mt-6">
            <label className="block mb-2">Thumbnail</label>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="w-64 rounded-lg object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setThumbnail(file);

                setThumbnailPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* Video */}

          <div className="mt-6">
            <label className="block mb-2">Video</label>
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-72 h-40 rounded-lg border border-zinc-700 bg-black"
              />
            )}

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setVideo(file);

                setVideoPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-4 text-xl font-semibold"
          >
            Update Memory
          </button>
        </div>
      </div>
    </div>
  );
}
