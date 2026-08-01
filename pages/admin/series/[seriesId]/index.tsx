import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

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

  const openCreateEpisodeModal = () => {
    resetEpisodeForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!router.isReady) return;

    fetchSeries();
  }, [router.isReady]);

  const handleEditEpisode = async (episodeId: string) => {
    try {
      const response = await fetch(`/api/episodes/${episodeId}`);

      if (!response.ok) {
        throw new Error("Failed to load series.");
      }

      const episode = await response.json();

      setEditingEpisode(episode);

      setEpisodeNumber(episode.episodeNumber.toString());
      setTitle(episode.title);
      setDescription(episode.description);
      setDuration(episode.duration);

      // Don't preload files
      setThumbnail(null);
      setVideo(null);

      setIsModalOpen(true);
    } catch (error: any) {
      alert(error.message || "Failed to load episode.");
    }
  };
  const fetchSeries = async () => {
    try {
      const response = await fetch(`/api/series/${router.query.seriesId}`);

      const data = await response.json();

      setSeries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async (file: File, type: "thumbnail" | "video") => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`${type} upload failed`);
    }

    const data = await response.json();

    return data.url;
  };

  const handleSubmitEpisode = async () => {
    try {
      if (!editingEpisode && (!thumbnail || !video)) {
        alert("Please select thumbnail and video.");
        setLoading(false);
        return;
      }
      setLoading(true);

      let thumbnailUrl = editingEpisode?.thumbnailUrl;
      let videoUrl = editingEpisode?.videoUrl;

      // Upload new thumbnail only if selected
      if (thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail, "thumbnail");
      }

      // Upload new video only if selected
      if (video) {
        videoUrl = await uploadFile(video, "video");
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
          title,
          description,
          duration,
          episodeNumber: Number(episodeNumber),
          thumbnailUrl,
          videoUrl,
          seriesId: series.id,
          showOnHome: editingEpisode?.showOnHome ?? false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.error);
      }

      alert(
        editingEpisode
          ? "Episode updated successfully!"
          : "Episode created successfully!",
      );

      resetEpisodeForm();
      setIsModalOpen(false);
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
      <div className="min-h-screen bg-zinc-900 flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Banner */}
      <img
        src={series.bannerUrl}
        alt={series.title}
        className="w-full h-80 object-cover"
      />

      <div className="max-w-6xl mx-auto p-8">
        {/* Back Button */}
        <Link href="/admin/series">
          <button className="mb-8 bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600">
            ← Back to Series
          </button>
        </Link>

        {/* Thumbnail + Details */}
        <div className="flex gap-8">
          <img
            src={series.thumbnailUrl}
            alt={series.title}
            className="w-60 rounded-lg"
          />

          <div>
            <h1 className="text-5xl font-bold">{series.title}</h1>

            <p className="text-zinc-400 mt-3">{series.genre}</p>

            <p className="mt-6 leading-7">{series.description}</p>
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-16 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Episodes</h2>

          <button
            onClick={() => {
              openCreateEpisodeModal();
            }}
            className="bg-red-600 px-5 py-3 rounded-lg hover:bg-red-700"
          >
            + Add Episode
          </button>
        </div>

        <div className="mt-8">
          {series.episodes.length === 0 ? (
            <div className="bg-zinc-800 rounded-lg p-10 text-center">
              <p className="text-zinc-400 text-lg">No Episodes Added Yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {series.episodes.map((episode: any) => (
                <div
                  key={episode.id}
                  className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={episode.thumbnailUrl}
                      alt={episode.title}
                      className="w-32 h-20 object-cover rounded"
                    />

                    <div>
                      <h3 className="text-xl font-semibold">
                        Episode {episode.episodeNumber}: {episode.title}
                      </h3>

                      <p className="text-zinc-400">{episode.duration}</p>

                      <p className="text-zinc-500 text-sm mt-1">
                        {episode.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={episode.showOnHome}
                          onChange={() => handleToggleShowOnHome(episode)}
                          className="w-4 h-4 accent-red-600 cursor-pointer"
                        />

                        <span className="text-sm text-zinc-300">
                          Show on Home
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditEpisode(episode.id)}
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteEpisode(episode.id)}
                      className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg w-full max-w-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">
              {editingEpisode ? "Edit Episode" : "Add Episode"}
            </h2>

            <div className="space-y-4">
              <input
                type="number"
                placeholder="Episode Number"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(e.target.value)}
                className="w-full bg-zinc-800 p-3 rounded"
              />

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-800 p-3 rounded"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-800 p-3 rounded"
                rows={4}
              />

              <input
                type="text"
                placeholder="Duration (e.g. 48 min)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-zinc-800 p-3 rounded"
              />

              <div>
                <label className="block mb-2">Thumbnail</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label className="block mb-2">Video</label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  resetEpisodeForm();
                  setIsModalOpen(false);
                }}
                className="bg-zinc-700 px-6 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitEpisode}
                disabled={loading}
                className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 disabled:bg-zinc-600"
              >
                {editingEpisode ? "Update Episode" : "Save Episode"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
