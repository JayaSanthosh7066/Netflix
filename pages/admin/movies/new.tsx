import { useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

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
  const uploadFile = async (file: File, type: "video" | "thumbnail") => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    return await response.json();
  };

  const handleSubmit = async () => {
    if (!video) {
      alert("Please select a video");
      return;
    }

    if (!thumbnail) {
      alert("Please select a thumbnail");
      return;
    }

    // Upload video first
    const videoResponse = await uploadFile(video, "video");
    console.log("Video:", videoResponse);

    // Upload thumbnail next
    const thumbnailResponse = await uploadFile(thumbnail, "thumbnail");
    console.log("Thumbnail:", thumbnailResponse);

    // alert("Both files uploaded successfully!");
    await fetch("/api/movie", {
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

    alert("Movie uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <h1 className="text-5xl font-bold mb-10 text-red-600">Add a Memory</h1>

        <div className="bg-zinc-800 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Upload A Video</h2>

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

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setThumbnail(e.target.files ? e.target.files[0] : null)
              }
              className="w-full rounded-lg bg-zinc-700 p-3"
            />
          </div>

          {/* Video */}

          <div className="mt-6">
            <label className="block mb-2">Video</label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideo(e.target.files ? e.target.files[0] : null)
              }
              className="w-full rounded-lg bg-zinc-700 p-3"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-4 text-xl font-semibold"
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
}
