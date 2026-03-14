import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, ClipboardList, ShieldCheck, Sparkles, Wallet } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };

  const fastTransition = { duration: 0.24, ease: [0.22, 1, 0.36, 1] };
  const features = [
    {
      title: "Budget Tracking",
      desc: "Monitor expenses in real time and keep every renovation decision anchored to your plan.",
      icon: Wallet,
    },
    {
      title: "Task Management",
      desc: "Turn messy renovation to-dos into a clear timeline with reminders, ownership, and momentum.",
      icon: ClipboardList,
    },
    
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.35),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(45,212,191,0.25),_transparent_24%),linear-gradient(135deg,_#ecfdf5_0%,_#f8fafc_45%,_#e0f2fe_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_22%),radial-gradient(circle_at_80%_20%,_rgba(45,212,191,0.15),_transparent_18%),linear-gradient(145deg,_#020617_0%,_#0f172a_52%,_#052e2b_100%)]">
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
        <motion.div
          animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, 20, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[12%] top-[26%] h-20 w-20 rounded-[28px] border border-white/60 bg-white/30 backdrop-blur-xl"
        />
        <motion.div
          animate={reduceMotion ? { y: 0, x: 0 } : { y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[18%] top-[18%] h-28 w-28 rounded-full border border-emerald-200/70 bg-emerald-100/50 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10"
        />
      </div>

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/60 px-6 py-5 backdrop-blur-xl md:px-10 dark:border-slate-800 dark:bg-slate-900/60">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          HomeTracker
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="motion-button rounded-xl border border-emerald-600 px-5 py-2 text-emerald-600 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl dark:border-slate-700 dark:text-gray-100 dark:hover:bg-slate-800"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="motion-button rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_60px_-24px_rgba(16,185,129,0.75)]"
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
        className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="text-center lg:text-left">
          <motion.div
            variants={reveal}
            transition={{ ...fastTransition, delay: 0.02 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-sm font-medium text-emerald-800 shadow-lg shadow-emerald-950/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/55 dark:text-emerald-200"
          >
            <Sparkles className="h-4 w-4" />
            Home renovation command center
          </motion.div>

          <motion.h2
            variants={reveal}
            transition={{ ...fastTransition, delay: 0.06 }}
            className="mb-6 max-w-4xl text-5xl font-bold leading-[1.05] text-gray-900 dark:text-gray-100 md:text-6xl lg:text-7xl"
          >
            Bring calm, clarity, and motion to every{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              renovation decision
            </span>
            .
          </motion.h2>

          <motion.p
            variants={reveal}
            transition={{ ...fastTransition, delay: 0.12 }}
            className="mb-10 max-w-2xl text-lg text-[var(--text-secondary)] dark:text-gray-200"
          >
            Track budgets, tasks, contractors, permits, and photo progress in one elegant
            workspace designed for homeowners who want fewer surprises and more control.
          </motion.p>

          <motion.div
            variants={reveal}
            transition={{ ...fastTransition, delay: 0.18 }}
            className="flex flex-wrap justify-center gap-5 lg:justify-start"
          >
            <button
              onClick={() => navigate("/signup")}
              className="motion-button rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_60px_-24px_rgba(16,185,129,0.75)]"
            >
              Start Free Today
            </button>

            <button
              onClick={() => navigate("/login")}
              className="motion-button rounded-2xl border border-white/70 bg-white/70 px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/60 dark:text-gray-100 dark:hover:bg-slate-900"
            >
              Login
            </button>
          </motion.div>

          <motion.div
            variants={reveal}
            transition={{ ...fastTransition, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-emerald-900/85 dark:text-emerald-200 lg:justify-start"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow-sm backdrop-blur-xl dark:bg-slate-900/50">
              <ShieldCheck className="h-4 w-4" />
              Organized project history
            </span>
            <a
              href="#features"
              className="motion-link motion-link-underline font-medium text-emerald-700 dark:text-emerald-300"
            >
              Explore features
            </a>
          </motion.div>
        </div>

        <motion.div
          variants={reveal}
          transition={{ ...fastTransition, delay: 0.16 }}
          className="relative"
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/60"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Renovation Snapshot
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Kitchen refresh
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                78% on track
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-5 text-white shadow-lg">
                <p className="text-sm text-white/80">Budget used</p>
                <p className="mt-3 text-3xl font-bold">$18.4k</p>
                <p className="mt-2 text-sm text-white/80">of $24k planned</p>
              </div>
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-lg backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/55">
                <p className="text-sm text-slate-500 dark:text-slate-300">Upcoming today</p>
                <ul className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <span>Tile delivery</span>
                    <span>2 PM</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <span>Paint approval</span>
                    <span>5 PM</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

         
        </motion.div>
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
        className="mx-auto grid max-w-6xl gap-8 px-8 pb-24 md:grid-cols-3"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={index}
              variants={reveal}
              transition={fastTransition}
              className="card-hover-lift rounded-[30px] border border-white/80 bg-white/60 p-8 shadow-lg shadow-slate-950/5 backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/55"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-700 shadow-sm dark:bg-emerald-500/15 dark:text-emerald-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)] dark:text-slate-200">{feature.desc}</p>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}
