import { useEffect } from "react";
import { BarChart3, CalendarClock, Download, Loader2, Target, TrendingUp } from "lucide-react";

import api from "@/api/api";
import useProjectInsights from "@/hooks/useProjectInsights";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatDateTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function getStatusColor(status) {
  if (status === "completed") return "bg-emerald-500";
  if (status === "in_progress") return "bg-blue-500";
  return "bg-amber-500";
}

export default function ProjectOverviewSection({ projectId }) {
  const { progress, analytics, loading, error, fetchInsights } = useProjectInsights(projectId);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const downloadReport = async () => {
    if (!projectId) return;

    const response = await api.get(`/report/${projectId}`, {
      responseType: "blob",
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const contentType = response.headers?.["content-type"] || "";

    if (contentType.includes("application/json")) {
      const text = await response.data.text();
      const parsed = JSON.parse(text || "{}");
      const jsonBlob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
      const jsonUrl = window.URL.createObjectURL(jsonBlob);
      const jsonAnchor = document.createElement("a");
      jsonAnchor.href = jsonUrl;
      jsonAnchor.download = `project-report-${projectId}.json`;
      document.body.appendChild(jsonAnchor);
      jsonAnchor.click();
      jsonAnchor.remove();
      window.URL.revokeObjectURL(jsonUrl);
      return;
    }

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `project-report-${projectId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const completion = progress?.completionPercentage ?? progress?.estimatedCompletion ?? 0;
  const ratio = progress?.taskCompletionRatio || `${progress?.completedTasks || 0}/${progress?.totalTasks || 0}`;

  const budgetSeries = Array.isArray(analytics?.budgetSeries) ? analytics.budgetSeries : [];
  const taskStatusDistribution = Array.isArray(analytics?.taskStatusDistribution)
    ? analytics.taskStatusDistribution
    : [];
  const expenseBreakdown = Array.isArray(analytics?.expenseBreakdown) ? analytics.expenseBreakdown : [];

  const totalStatus = taskStatusDistribution.reduce((sum, item) => sum + Number(item?.count || 0), 0);
  const totalExpenseByCategory = expenseBreakdown.reduce((sum, item) => sum + Number(item?.amount || 0), 0);

  if (loading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-52 animate-pulse rounded-3xl border bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="rounded-3xl border">
          <CardContent className="py-8 text-center text-red-600">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Completion</p>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <p className="text-2xl font-bold">{completion}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, completion)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Task Ratio</p>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <p className="text-2xl font-bold">{ratio}</p>
            </div>
            <p className="text-sm text-muted-foreground">Completed / Total tasks</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Estimated Completion</p>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold">{formatDateTime(progress?.estimatedCompletionDate)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Auto-estimated from deadlines and progress pace</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Report</p>
            <Button className="h-10 w-full rounded-xl" onClick={downloadReport} disabled={!projectId}>
              <Download className="h-4 w-4" />
              Download Project Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border lg:col-span-1">
          <CardContent className="space-y-3 p-5">
            <h3 className="text-lg font-semibold tracking-tight">Budget vs Spent</h3>
            <div className="space-y-2">
              {budgetSeries.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.label}</span>
                    <span>INR {Number(item.value || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          100,
                          analytics?.totalBudget > 0
                            ? (Number(item.value || 0) / Number(analytics.totalBudget || 1)) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border lg:col-span-1">
          <CardContent className="space-y-3 p-5">
            <h3 className="text-lg font-semibold tracking-tight">Task Status Distribution</h3>
            <div className="space-y-2">
              {taskStatusDistribution.map((item) => {
                const percent = totalStatus > 0 ? Math.round((Number(item?.count || 0) / totalStatus) * 100) : 0;
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{String(item.status || "pending").replace("_", " ")}</span>
                      <span>{item.count} ({percent}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${getStatusColor(item.status)}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border lg:col-span-1">
          <CardContent className="space-y-3 p-5">
            <h3 className="text-lg font-semibold tracking-tight">Expense Breakdown</h3>
            <div className="space-y-2">
              {expenseBreakdown.length === 0 && (
                <p className="text-sm text-muted-foreground">No categorized expenses yet.</p>
              )}

              {expenseBreakdown.map((item) => {
                const percent = totalExpenseByCategory > 0
                  ? Math.round((Number(item.amount || 0) / totalExpenseByCategory) * 100)
                  : 0;

                return (
                  <div key={item.category} className="flex items-center justify-between rounded-xl border p-2 text-sm">
                    <span className="capitalize text-muted-foreground">{item.category}</span>
                    <span className="font-medium">INR {Number(item.amount || 0).toLocaleString()} ({percent}%)</span>
                  </div>
                );
              })}
            </div>

            {!!analytics?.healthStatus && (
              <Badge
                className={
                  analytics.healthStatus === "healthy"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : analytics.healthStatus === "budget_risk"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }
              >
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                {analytics.healthStatus.replace("_", " ")}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5" />
        Insights auto-refresh when reopening this tab.
      </div>
    </div>
  );
}
