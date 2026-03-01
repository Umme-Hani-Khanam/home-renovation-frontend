import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/api"

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/login", form)

      localStorage.setItem("token", res.data.token)

      navigate("/dashboard")

    } catch (err) {
      console.error(err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">

      <div className="bg-[var(--surface)] border border-gray-200 dark:border-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to Your Workspace
        </h2>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-2"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-2"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

      </div>

    </div>
  )
}