// src/components/layout/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Sparkles } from "lucide-react";
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

export default function Sidebar() {
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `
    flex items-center gap-2 rounded-xl px-4 py-2.5
    text-sm font-semibold transition-all duration-200
    ${
      isActive
        ? "bg-emerald-600 text-white shadow-md"
        : `
          text-slate-800
          hover:bg-emerald-100 hover:text-emerald-800
          dark:text-white
          dark:hover:bg-slate-800
          dark:hover:text-emerald-400
        `
    }
    `;

  return (
    <aside
      className="
        fixed top-0 left-0
        h-screen w-72
        flex flex-col
        border-r border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-950
        p-6
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          RenovationPro
        </h1>
        <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Workspace
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1 space-y-2 overflow-y-auto pr-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.highlight && (
              <Sparkles size={14} className="text-emerald-500" />
            )}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setDark(!dark)}
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl bg-emerald-600 py-2
            text-sm font-semibold text-white
            transition hover:bg-emerald-700
          "
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={logout}
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl border border-rose-300
            bg-rose-50 py-2
            text-sm font-semibold text-rose-700
            transition hover:bg-rose-100
            dark:border-rose-400/40
            dark:bg-rose-500/10
            dark:text-rose-300
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}