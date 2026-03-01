import { BellRing } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import useReminderCount from "@/hooks/useReminderCount";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
  const { count } = useReminderCount();
  const location = useLocation();
  const navigate = useNavigate();

  const showReminderBanner = count > 0 && !location.pathname.includes("/dashboard/reminders");

  return (
    <div className="min-h-screen bg-[var(--bg)] md:flex">
      <Sidebar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {showReminderBanner && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
              <div className="inline-flex items-center gap-2 text-sm font-medium">
                <BellRing className="h-4 w-4" />
                {count} reminder{count > 1 ? "s" : ""} pending action.
              </div>
              <Button
                size="sm"
                className="h-8 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                onClick={() => navigate("/dashboard/reminders")}
              >
                Review
              </Button>
            </div>
          )}

          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
