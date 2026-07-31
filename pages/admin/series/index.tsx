import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
export default function SeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    const response = await fetch("/api/series");
    const data = await response.json();

    setSeries(data);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Series</h1>

        <Link href="/admin/series/new">
          <button className="bg-red-600 px-5 py-3 rounded-lg">
            + Create Series
          </button>
        </Link>
      </div>

      {series.length === 0 && <p>No Series Created Yet.</p>}

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
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Manage
                </button>

                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                  Edit
                </button>

                <button className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
