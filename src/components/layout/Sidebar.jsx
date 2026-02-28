import { NavLink } from "react-router-dom"
import { useTheme } from "@/context/ThemeContext"

export default function Sidebar() {
  const { dark, setDark } = useTheme()

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-xl transition ${
      isActive
        ? "bg-emerald-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-slate-800"
    }`

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900">

      <h1 className="text-2xl font-bold mb-8">
        RenovationPro
      </h1>

      <nav className="space-y-2 flex-1">

        <NavLink to="/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/projects" className={linkClass}>
          Projects
        </NavLink>

        <NavLink to="/dashboard/tasks" className={linkClass}>
          Tasks
        </NavLink>

        <NavLink to="/dashboard/expenses" className={linkClass}>
          Expenses
        </NavLink>

        <NavLink to="/dashboard/contractors" className={linkClass}>
          Contractors
        </NavLink>

        <NavLink to="/dashboard/inventory" className={linkClass}>
          Inventory
        </NavLink>

        <NavLink to="/dashboard/materials" className={linkClass}>
          Materials
        </NavLink>

        <NavLink to="/dashboard/permits" className={linkClass}>
          Permits
        </NavLink>

        <NavLink to="/dashboard/photos" className={linkClass}>
          Photos
        </NavLink>

        <NavLink to="/dashboard/reminders" className={linkClass}>
          Reminders
        </NavLink>

        <NavLink to="/dashboard/shopping" className={linkClass}>
          Shopping
        </NavLink>

      </nav>

      <button
        onClick={() => setDark(!dark)}
        className="mt-6 bg-emerald-600 text-white rounded-xl py-2"
      >
        Toggle Theme
      </button>

    </div>
  )
}