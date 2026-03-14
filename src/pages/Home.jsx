import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };

  const fastTransition = { duration: 0.24, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={reduceMotion ? { y: 0 } : { y: [0, -14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-emerald-300/30 blur-3xl"
        />
        <motion.div
          animate={reduceMotion ? { y: 0 } : { y: [0, 16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-120px] right-[-120px] h-[450px] w-[450px] rounded-full bg-teal-300/30 blur-3xl"
        />
      </div>

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/60 px-10 py-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          HomeTracker
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="motion-button rounded-xl border border-emerald-600 px-5 py-2 text-emerald-600 shadow-sm hover:bg-emerald-50 hover:shadow-md dark:border-slate-700 dark:text-gray-100 dark:hover:bg-slate-800"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="motion-button rounded-xl bg-emerald-600 px-5 py-2 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md"
          >
            Sign Up
          </button>
        </div>
      </header>

      <motion.section
        initial="hidden"
        animate="show"
        variants={reveal}
        transition={fastTransition}
        className="flex flex-col items-center justify-center px-6 pb-16 pt-20 text-center"
      >
        <motion.h2
          variants={reveal}
          transition={{ ...fastTransition, delay: 0.04 }}
          className="mb-6 max-w-4xl text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100 md:text-6xl"
        >
          Manage Every Home{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Renovation Project
          </span>
        </motion.h2>

        <motion.p
          variants={reveal}
          transition={{ ...fastTransition, delay: 0.1 }}
          className="mb-10 max-w-2xl text-lg text-[var(--text-secondary)] dark:text-gray-200"
        >
          Track budgets, tasks, contractors, permits, and progress photos - all in one
          powerful dashboard built for homeowners and contractors.
        </motion.p>

        <motion.div
          variants={reveal}
          transition={{ ...fastTransition, delay: 0.16 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <button
            onClick={() => navigate("/signup")}
            className="motion-button rounded-2xl bg-emerald-600 px-8 py-4 text-lg text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl"
          >
            Start Free Today
          </button>

          <button
            onClick={() => navigate("/login")}
            className="motion-button rounded-2xl border border-gray-300 px-8 py-4 text-lg text-gray-900 shadow-sm hover:bg-gray-100 hover:shadow-md dark:border-slate-700 dark:text-gray-100 dark:hover:bg-slate-800"
          >
            Login
          </button>
        </motion.div>

        <motion.a
          href="#features"
          variants={reveal}
          transition={{ ...fastTransition, delay: 0.2 }}
          className="motion-link motion-link-underline mt-6 text-sm font-medium text-emerald-700 dark:text-emerald-300"
        >
          Explore features
        </motion.a>
      </motion.section>

      <motion.section
        id="features"
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
        }}
        className="mx-auto grid max-w-6xl gap-8 px-8 pb-20 md:grid-cols-3"
      >
        {[
          {
            title: "Budget Tracking",
            desc: "Monitor expenses in real time and avoid overspending.",
          },
          {
            title: "Task Management",
            desc: "Assign and track renovation tasks effortlessly.",
          },
          {
            title: "Contractor Oversight",
            desc: "Manage vendors, timelines, and communication.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={reveal}
            transition={fastTransition}
            className="card-hover-lift rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg backdrop-blur-xl hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/70"
          >
            <h3 className="mb-4 text-xl font-semibold text-emerald-600">{feature.title}</h3>
            <p className="text-[var(--text-secondary)]">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}

