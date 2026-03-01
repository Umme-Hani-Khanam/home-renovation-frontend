import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import api from "@/api/api"

export default function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) {
      return setError("All fields are required.")
    }

    try {
      setLoading(true)
      await api.post("/auth/signup", form)
      navigate("/login")
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >

        <h2 className="text-3xl font-bold mb-2 text-center">
          Create Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Start managing your renovation projects
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white py-3 rounded-xl font-semibold shadow-md"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </form>

      </motion.div>

    </div>
  )
}