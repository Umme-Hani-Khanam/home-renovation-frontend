import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-emerald-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-120px] right-[-120px] w-[450px] h-[450px] bg-teal-300/30 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          HomeTracker
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl shadow-md transition-all duration-200 active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl"
        >
          Manage Every Home{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Renovation Project
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl"
        >
          Track budgets, tasks, contractors, permits, and progress photos — all in one powerful dashboard built for homeowners and contractors.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex gap-6"
        >
          <button
            onClick={() => navigate("/signup")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-lg shadow-xl transition-all duration-200 active:scale-95"
          >
            Start Free Today
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 dark:border-slate-700 px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Login
          </button>
        </motion.div>

      </section>

      {/* Feature Section */}
      <section className="px-8 pb-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {[
          {
            title: "Budget Tracking",
            desc: "Monitor expenses in real time and avoid overspending."
          },
          {
            title: "Task Management",
            desc: "Assign and track renovation tasks effortlessly."
          },
          {
            title: "Contractor Oversight",
            desc: "Manage vendors, timelines, and communication."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-4 text-emerald-600">
              {feature.title}
            </h3>
            <p className="text-[var(--text-secondary)]">
              {feature.desc}
            </p>
          </motion.div>
        ))}

      </section>

    </div>
  )
}