import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api/api";

export default function Signup() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      return setError("Email and password are required.");
    }

    try {
      setLoading(true);
      await api.post("/auth/signup", {
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/80 p-10 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"
      >
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create Account
        </h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-200">
          Start managing your renovation projects
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-gray-100 dark:placeholder:text-gray-400"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-gray-100 dark:placeholder:text-gray-400"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="motion-button w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[var(--text-secondary)] dark:text-gray-200">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="motion-link motion-link-underline cursor-pointer font-semibold text-emerald-600 dark:text-indigo-400"
            >
              Login
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
