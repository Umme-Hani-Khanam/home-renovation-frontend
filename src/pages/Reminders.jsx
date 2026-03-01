import { useEffect, useMemo, useState, useCallback } from "react";
import { BellRing, CalendarClock, CheckCircle2, Clock3 } from "lucide-react";

import api from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialForm = {
  title: "",
  description: "",
  reminder_date: "",
};

function formatReminderDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(initialForm);

  // ---------------- FETCH REMINDERS ----------------
  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/reminders");

      const safe = Array.isArray(data?.data) ? data.data : [];
      setReminders(safe);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reminders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // ---------------- CREATE REMINDER ----------------
  const createReminder = async () => {
    if (!form.title.trim() || !form.reminder_date) {
      setFormError("Title and reminder date are required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      setError("");

      await api.post("/reminders", {
        title: form.title.trim(),
        description: form.description.trim() || null,
        reminder_date: new Date(form.reminder_date).toISOString(),
      });

      setForm(initialForm);
      setOpen(false);
      fetchReminders();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create reminder");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- COMPLETE REMINDER ----------------
  const completeReminder = async (id) => {
    try {
      await api.patch(`/reminders/${id}/complete`);
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark reminder as done");
    }
  };

  const upcomingReminders = useMemo(() => {
    const safe = Array.isArray(reminders) ? reminders : [];
    return safe.filter((r) => r.completed === false);
  }, [reminders]);

  const now = Date.now();

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage standalone reminders with clean in-app actions.
          </p>
        </div>

        <Button
          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setOpen(true)}
        >
          + Add Reminder
        </Button>
      </div>

      <Card className="rounded-3xl border bg-[var(--surface)] shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <BellRing className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold tracking-tight">
                Upcoming Reminders
              </h2>
            </div>
            <Badge className="border-blue-200 bg-blue-50 text-blue-700">
              {upcomingReminders.length} pending
            </Badge>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl border bg-slate-100"
                />
              ))}
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          {!loading && upcomingReminders.length === 0 && (
            <div className="rounded-2xl border border-dashed py-10 text-center text-muted-foreground">
              <CalendarClock className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p>No upcoming reminders.</p>
            </div>
          )}

          <div className="space-y-3">
            {upcomingReminders.map((reminder) => {
              const reminderTime = new Date(reminder.reminder_date || 0).getTime();
              const isDue = reminderTime > 0 && reminderTime <= now;

              return (
                <Card key={reminder.id} className="rounded-2xl border">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {reminder.title || "Untitled reminder"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {reminder.description || "No description"}
                      </p>
                      <div className="inline-flex items-center gap-2">
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
                        <p className="text-xs text-muted-foreground">
                          {formatReminderDate(reminder.reminder_date)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="h-10 rounded-xl"
                      onClick={() => completeReminder(reminder.id)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Done
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <Input
              type="datetime-local"
              value={form.reminder_date}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  reminder_date: e.target.value,
                }))
              }
            />

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <Button
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={createReminder}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Reminder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}