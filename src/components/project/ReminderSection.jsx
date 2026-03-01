import { useEffect, useState } from "react";
import { BellRing, CheckCircle2, Clock3 } from "lucide-react";

import useUpcomingReminders from "@/hooks/useUpcomingReminders";
import { useProject } from "@/context/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatReminderDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function ReminderSection() {
  const { selectedProject } = useProject();
  const { reminders, loading, error, fetchUpcomingReminders, markReminderDone, setError } = useUpcomingReminders();
  const [timeAnchor] = useState(() => Date.now());

  useEffect(() => {
    fetchUpcomingReminders();
  }, [fetchUpcomingReminders]);

  const safeReminders = Array.isArray(reminders) ? reminders : [];
  const projectReminders = selectedProject?.id
    ? safeReminders.filter((item) => item.project_id === selectedProject.id)
    : safeReminders;

  const markDone = async (taskId) => {
    try {
      setError("");
      await markReminderDone(taskId);
      fetchUpcomingReminders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark reminder as done");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-2xl border bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (!projectReminders.length) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-8 text-center text-muted-foreground">
          <BellRing className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          No upcoming reminders.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {projectReminders.map((reminder) => {
        const reminderTime = new Date(reminder?.reminder_at || 0).getTime();
        const isDue = reminderTime > 0 && reminderTime <= timeAnchor;

        return (
          <Card key={reminder.id} className="rounded-2xl border">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{reminder.title || "Untitled reminder"}</h3>
                <Badge
                  className={
                    isDue
                      ? "animate-pulse border-rose-200 bg-rose-50 text-rose-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  <Clock3 className="mr-1 h-3.5 w-3.5" />
                  {isDue ? "Due now" : "Scheduled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{reminder.description || "No description"}</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{formatReminderDate(reminder.reminder_date)}</p>
                <Button variant="outline" className="h-9 rounded-xl" onClick={() => markDone(reminder.id)}>
                  <CheckCircle2 className="h-4 w-4" />
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
