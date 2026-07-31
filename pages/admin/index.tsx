import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="space-y-6 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>

        <Link href="/admin/movies">
          <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-lg font-semibold">
            Movies
          </button>
        </Link>

        <Link href="/admin/series">
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-lg font-semibold">
            Series
          </button>
        </Link>
      </div>
    </div>
  );
}
