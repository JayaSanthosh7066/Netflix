import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import ImagePicker from "@/components/ImagePicker";
import { uploadFile } from "@/libs/uploadFile";

export default function NewImageSeriesPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/image-series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create image series");
      }

      router.push(`/admin/image-series/${data.id}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#18181b] px-4 py-6 text-white sm:px-6 lg:px-10">
      {/* HEADER */}
      <header className="mb-8">
        <button
          onClick={() => router.push("/admin/image-series")}
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
          Back to Image Series
        </button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Image Series
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Create a collection and add your photos to it.
          </p>
        </div>
      </header>

      {/* FORM */}
      <div className="mx-auto max-w-3xl">
        <div
          className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            shadow-xl
          "
        >
          {/* BASIC INFORMATION */}
          <div className="border-b border-zinc-800 px-5 py-6 sm:px-7">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Series Information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Give your image collection a name and description.
              </p>
            </div>

            <div className="space-y-6">
              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Image Series Title
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Our Wedding"
                  disabled={loading}
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
                    disabled:cursor-not-allowed
                    disabled:opacity-50
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this collection..."
                  rows={5}
                  disabled={loading}
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
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
              </div>
            </div>
          </div>

          {/* COVER INFO */}
          <div className="px-5 py-6 sm:px-7">
            <div className="flex items-center gap-3">
              <PhotoIcon className="h-6 w-6 text-red-500" />

              <h2 className="text-xl font-semibold text-white">Series Cover</h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              The first image you upload will automatically become the cover
              image for this series.
            </p>
          </div>

          {/* ACTIONS */}
          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-zinc-800
              px-5
              py-5
              sm:flex-row
              sm:justify-end
              sm:px-7
            "
          >
            <button
              type="button"
              onClick={() => router.push("/admin/image-series")}
              disabled={loading}
              className="
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
              onClick={handleCreate}
              disabled={loading}
              className="
                rounded-lg
                bg-red-600
                px-7
                py-3
                font-semibold
                text-white
                transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:bg-zinc-700
                disabled:text-zinc-400
              "
            >
              {loading ? "Creating..." : "Create Image Series"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
