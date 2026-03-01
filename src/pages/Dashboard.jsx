import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FolderKanban, Gauge, TrendingUp } from "lucide-react";

import api from "@/api/api";
import BudgetPie from "@/components/BudgetPie";
import { Card, CardContent } from "@/components/ui/card";

function formatCurrency(value) {
  return `INR ${Number(value || 0).toLocaleString()}`;
}

function StatCard({ title, value, icon, progress, tone }) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const barClass = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="transition-transform duration-200 hover:-translate-y-1">
      <Card className="rounded-3xl border bg-[var(--surface)] shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <span className={`rounded-full border p-2 ${toneClass[tone] || toneClass.blue}`}>
              {icon}
            </span>
          </div>

          <p className="text-3xl font-bold tracking-tight">{value}</p>

          <div className="space-y-1">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${barClass[tone] || barClass.blue}`}
                style={{ width: `${Math.max(0, Math.min(100, progress || 0))}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress || 0)}% reference scale</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setSummary(res.data?.data || {});
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalProjects = summary?.totalProjects || 0;
  const activeProjects = summary?.activeProjects || 0;
  const completedProjects = summary?.completedProjects || 0;
  const overdueTasks = summary?.overdueTasks || 0;

  const totalBudget = summary?.totalBudget || 0;
  const totalSpent = summary?.totalSpent || 0;
  const remaining = Math.max(totalBudget - totalSpent, 0);

  const spendPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const projectScaleDenominator = Math.max(totalProjects, 1);

  const stats = useMemo(
    () => [
      {
        title: "Projects",
        value: totalProjects,
        progress: 100,
        icon: <FolderKanban className="h-4 w-4" />,
        tone: "blue",
      },
      {
        title: "Active",
        value: activeProjects,
        progress: (activeProjects / projectScaleDenominator) * 100,
        icon: <TrendingUp className="h-4 w-4" />,
        tone: "amber",
      },
      {
        title: "Completed",
        value: completedProjects,
        progress: (completedProjects / projectScaleDenominator) * 100,
        icon: <CheckCircle2 className="h-4 w-4" />,
        tone: "emerald",
      },
      {
        title: "Overdue Tasks",
        value: overdueTasks,
        progress: Math.min(overdueTasks * 10, 100),
        icon: <AlertTriangle className="h-4 w-4" />,
        tone: overdueTasks > 0 ? "rose" : "emerald",
      },
    ],
    [
      totalProjects,
      activeProjects,
      completedProjects,
      overdueTasks,
      projectScaleDenominator,
    ]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-3xl border bg-slate-100" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl border bg-slate-100" />
          <div className="h-80 animate-pulse rounded-3xl border bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="rounded-3xl border bg-[var(--surface)]">
        <CardContent className="py-10 text-center text-red-500">{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Overview</p>
        <h1 className="text-3xl font-bold tracking-tight">Renovation Dashboard</h1>
        <p className="text-sm text-muted-foreground">A quick snapshot of projects, progress, and finances.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border bg-[var(--surface)] shadow-sm">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Budget Distribution</h2>
            <BudgetPie spent={totalSpent} total={totalBudget} />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-2 text-white/90">
              <Gauge className="h-5 w-5" />
              <h2 className="text-xl font-semibold tracking-tight">Financial Overview</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/85">Total Budget</span>
                <span className="font-semibold">{formatCurrency(totalBudget)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/85">Total Spent</span>
                <span className="font-semibold">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/30">
                <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(spendPct, 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-white/90">Remaining</span>
                <span className="text-lg font-bold">{formatCurrency(remaining)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
