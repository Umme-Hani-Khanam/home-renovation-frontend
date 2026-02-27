import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-emerald-700">
          HomeTracker
        </h1>

        <div className="space-x-4">
          <Link to="/signup">
            <button className="bg-emerald-600 text-white px-5 py-2 rounded-lg">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="border px-5 py-2 rounded-lg">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mt-28 px-4">
        <h2 className="text-5xl font-bold mb-6">
          Manage Every Home Renovation Project
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          Track budgets, tasks, materials, and photos —
          all in one beautiful dashboard.
        </p>

        <Link to="/signup">
          <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-emerald-700 transition">
            Get Started Free
          </button>
        </Link>
      </div>
    </div>
  );
}