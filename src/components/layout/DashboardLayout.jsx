import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">

      <div className="hidden md:flex w-72 border-r dark:border-slate-800">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </div>

    </div>
  )
}