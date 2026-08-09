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

  const [loading, setLoading] = useState(false);

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

      if (!genre.trim()) {
        alert("Please enter a genre");
        return;
      }

      if (!thumbnail) {
        alert("Please select a thumbnail");
        return;
      }

      setLoading(true);

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
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      {/* HEADER */}
      <header className="mx-auto w-full max-w-4xl">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.push("/admin/series")}
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
          Back to Series
        </button>

        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create New Series
          </h1>

          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Add a new series and start managing its episodes.
          </p>
        </div>
      </header>

      {/* FORM CARD */}
      <main className="mx-auto w-full max-w-4xl">
        <div
          className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-5
            shadow-xl
            sm:p-7
            lg:p-8
          "
        >
          {/* BASIC INFORMATION */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Provide the basic details about your series.
              </p>
            </div>

            {/* TITLE */}
            <div className="mb-6">
              <label
                htmlFor="series-title"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Series Title
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="series-title"
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
                  text-base
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-500
                  focus:border-red-500
                  focus:ring-1
                  focus:ring-red-500
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <label
                htmlFor="series-description"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                id="series-description"
                rows={5}
                placeholder="Enter a description for your series"
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
                  text-base
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-500
                  focus:border-red-500
                  focus:ring-1
                  focus:ring-red-500
                "
              />
            </div>

            {/* GENRE */}
            <div>
              <label
                htmlFor="series-genre"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Genre
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="series-genre"
                type="text"
                placeholder="Travel, Birthday, College..."
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
                  text-base
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-500
                  focus:border-red-500
                  focus:ring-1
                  focus:ring-red-500
                "
              />
            </div>
          </section>

          {/* DIVIDER */}
          <div className="my-8 border-t border-zinc-800" />

          {/* MEDIA */}
          {/* MEDIA */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Series Images
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Upload the images that will represent this series.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Thumbnail */}
              <div
                className="
        rounded-xl
        border border-zinc-800
        bg-zinc-800/50
        p-4
      "
              >
                <ImagePicker
                  label="Thumbnail"
                  file={thumbnail}
                  setFile={setThumbnail}
                  required
                />

                <p className="mt-3 text-xs text-zinc-500">
                  Required • Used for the series cards and listings.
                </p>
              </div>

              {/* Banner */}
              <div
                className="
        rounded-xl
        border border-zinc-800
        bg-zinc-800/50
        p-4
      "
              >
                <ImagePicker label="Banner" file={banner} setFile={setBanner} />

                <p className="mt-3 text-xs text-zinc-500">
                  Optional • Used for the series detail/banner view.
                </p>
              </div>
            </div>
          </section>

          {/* DIVIDER */}
          <div className="my-8 border-t border-zinc-800" />

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {/* CANCEL */}
            <button
              type="button"
              onClick={() => router.push("/admin/series")}
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
                sm:w-auto
              "
            >
              Cancel
            </button>

            {/* CREATE */}
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
                text-white
                transition
                hover:bg-red-700
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:bg-zinc-700
                disabled:text-zinc-400
                sm:w-auto
              "
            >
              {loading ? "Creating Series..." : "Create Series"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
