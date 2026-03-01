import { NavLink } from "react-router-dom";
import { ChevronDown, Moon, Sparkles, Sun } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import useReminderCount from "@/hooks/useReminderCount";

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
  { to: "/dashboard/reminders", label: "Reminders" },
  { to: "/dashboard/shopping", label: "Shopping" },
  { to: "/dashboard/inspiration", label: "Inspiration", highlight: true },
];

export default function Sidebar() {
  const { dark, setDark } = useTheme();
  const { count } = useReminderCount();

  const linkClass = ({ isActive }, item) =>
    `flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      item.highlight
        ? isActive
          ? "border border-amber-300 bg-amber-100 text-amber-900 shadow-[0_0_24px_rgba(245,158,11,0.35)]"
          : "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200"
        : isActive
        ? "bg-emerald-600 text-white shadow"
        : "text-slate-700 hover:bg-emerald-100 dark:text-slate-200 dark:hover:bg-slate-700"
    }`;

  return (
    <aside className="w-full border-b border-[var(--border)] bg-[var(--surface)] p-4 md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">RenovationPro</h1>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
      </div>

      <div className="relative md:h-[calc(100vh-11.5rem)]">
        <nav className="custom-scrollbar grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 md:max-h-full md:grid-cols-1 md:gap-1.5">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={(state) => linkClass(state, item)}>
              <span className="inline-flex items-center gap-1">
                {item.highlight && <Sparkles className="h-3.5 w-3.5" />}
                {item.label}
              </span>
              {item.label === "Reminders" && count > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-center justify-center bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/85 to-transparent pb-1 pt-8 md:flex">
          <ChevronDown className="h-4 w-4 animate-bounce text-muted-foreground" />
        </div>
      </div>

      <button
        onClick={() => setDark(!dark)}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-medium text-white transition active:scale-[0.98] hover:bg-emerald-700 md:mt-6"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
    </aside>
  );
}
