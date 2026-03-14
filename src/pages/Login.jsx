import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        email: form.email.trim(),
        password: form.password,
      };
      const res = await api.post("/auth/login", payload);
      const { success, token, user } = res.data ?? {};

      if (!success || !token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-[var(--surface)] p-10 shadow-xl dark:border-slate-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          Login to Your Workspace
        </h2>

        <div className="space-y-4">
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-gray-100 dark:placeholder:text-gray-400"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-gray-100 dark:placeholder:text-gray-400"
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
            className="motion-button w-full rounded-xl bg-emerald-600 py-2 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
