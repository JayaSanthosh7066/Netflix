import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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

      // Upload new thumbnail only if selected
      if (thumbnail) {
        const response = await uploadFile(thumbnail, "thumbnail");
        thumbnailUrl = response.url;
      }

      // Upload new banner only if selected
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
    <div className="min-h-screen bg-zinc-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Series</h1>

        <Link href="/admin/series/new">
          <button className="bg-red-600 px-5 py-3 rounded-lg hover:bg-red-700 transition">
            + Create Series
          </button>
        </Link>
      </div>

      {series.length === 0 ? (
        <div className="text-center text-zinc-400 mt-20">
          <p className="text-xl">No Series Created Yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {series.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">{item.title}</h2>

                <p className="text-gray-400 mt-2">{item.genre}</p>

                <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => router.push(`/admin/series/${item.id}`)}
                    className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600 transition"
                  >
                    Manage
                  </button>

                  <button
                    onClick={() => handleEditSeries(item)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteSeries(item.id)}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg w-full max-w-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Edit Series</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Series Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-800 p-3 rounded"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-zinc-800 p-3 rounded"
              />

              <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-zinc-800 p-3 rounded"
              />

              <ImagePicker
                label="Thumbnail (Leave empty to keep existing)"
                file={thumbnail}
                setFile={setThumbnail}
              />

              <ImagePicker
                label="Banner (Leave empty to keep existing)"
                file={banner}
                setFile={setBanner}
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="bg-zinc-700 px-6 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateSeries}
                disabled={loading}
                className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 disabled:bg-zinc-600"
              >
                {loading ? "Updating..." : "Update Series"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
