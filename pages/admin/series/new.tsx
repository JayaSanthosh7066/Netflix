import { useState } from "react";
import { useRouter } from "next/router";
import ImagePicker from "@/components/ImagePicker";
import { uploadFile } from "@/libs/uploadFile";
export default function CreateSeries() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      if (!title) {
        alert("Please enter a title");
        return;
      }

      if (!description) {
        alert("Please enter a description");
        return;
      }

      if (!genre) {
        alert("Please enter a genre");
        return;
      }

      if (!thumbnail) {
        alert("Please select a thumbnail");
        return;
      }

      // Upload Thumbnail
      // Upload Thumbnail
      const thumbnailResponse = await uploadFile(thumbnail, "thumbnail");
      const thumbnailUrl = thumbnailResponse.url;

      // Upload Banner (Optional)
      let bannerUrl = "";

      if (banner) {
        const bannerResponse = await uploadFile(banner, "banner");
        bannerUrl = bannerResponse.url;
      }

      // Save Series
      const response = await fetch("/api/series", {
        method: "POST",
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

      if (!response.ok) {
        throw new Error("Failed to create series");
      }

      await response.json();

      alert("Series Created Successfully!");

      router.push("/admin/series");
      // Later we'll redirect here
      // router.push(`/admin/series/${createdSeries.id}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center py-10">
      <div className="w-full max-w-2xl bg-zinc-800 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create New Series
        </h1>

        {/* Title */}
        <div className="mb-5">
          <label className="block mb-2">Series Title</label>

          <input
            type="text"
            placeholder="Enter series title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700 outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2">Description</label>

          <textarea
            rows={4}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700 outline-none resize-none"
          />
        </div>

        {/* Genre */}
        <div className="mb-5">
          <label className="block mb-2">Genre</label>

          <input
            type="text"
            placeholder="Travel, Birthday, College..."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700 outline-none"
          />
        </div>

        {/* Thumbnail */}
        <ImagePicker
          label="Thumbnail"
          file={thumbnail}
          setFile={setThumbnail}
          required
        />

        {/* Banner */}
        <ImagePicker label="Banner" file={banner} setFile={setBanner} />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-lg font-semibold"
        >
          Create Series
        </button>
      </div>
    </div>
  );
}
