// src/components/layout/DashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useTheme } from "@/context/ThemeContext";

export default function DashboardLayout() {
  const { dark } = useTheme();

  return (
    <div className={`${dark ? "dark" : ""}`}>
      <div className="min-h-screen bg-[var(--bg)] dark:bg-slate-950 transition-colors duration-300">
        
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="ml-72 min-h-screen">
          <div className="mx-auto max-w-[1400px] px-6 py-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}