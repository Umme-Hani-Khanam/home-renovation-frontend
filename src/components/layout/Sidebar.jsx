import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sparkles, Sun, X } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard/projects", label: "Projects" },
  { to: "/dashboard/tasks", label: "Tasks" },
  { to: "/dashboard/expenses", label: "Expenses" },
  { to: "/dashboard/contractors", label: "Contractors" },
  { to: "/dashboard/inventory", label: "Inventory" },
  { to: "/dashboard/materials", label: "Materials" },
  { to: "/dashboard/permits", label: "Permits" },
  { to: "/dashboard/photos", label: "Photos" },
  { to: "/dashboard/shopping", label: "Shopping" },
  { to: "/dashboard/inspiration", label: "Inspiration", highlight: true },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }, item) =>
    `flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      item.highlight
        ? isActive
          ? "bg-slate-900 text-white shadow-md dark:bg-slate-800 dark:text-indigo-400"
          : "bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
        : isActive
        ? "bg-emerald-600 text-white shadow-md dark:bg-slate-800 dark:text-indigo-400"
        : "text-slate-800 hover:bg-emerald-100 hover:text-emerald-800 dark:text-gray-200 dark:hover:bg-slate-800 dark:hover:text-gray-100"
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-200 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(85vw,18rem)] flex-col border-r border-slate-200 bg-white p-4 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 md:w-72 md:translate-x-0 md:p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-gray-100">
              RenovationPro
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Workspace
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="motion-button inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={(state) => linkClass(state, item)}
              onClick={onClose}
            >
              {item.highlight && <Sparkles size={14} className="shrink-0 text-emerald-500" />}
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            onClick={() => setDark(!dark)}
            className="motion-button inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={logout}
            className="motion-button inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
