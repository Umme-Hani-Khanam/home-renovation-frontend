import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">

      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-xl font-bold">HomeTracker</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
        >
          Go to Dashboard →
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <h2 className="text-5xl font-bold mb-6">
          Manage Every Home{" "}
          <span className="text-emerald-600">
            Renovation Project
          </span>
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Track budgets, tasks, contractors, permits, and progress photos — all in one dashboard.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl"
          >
            Start Free Today →
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="border px-6 py-3 rounded-xl"
          >
            View Demo
          </button>
        </div>

      </div>

    </div>
  )
}