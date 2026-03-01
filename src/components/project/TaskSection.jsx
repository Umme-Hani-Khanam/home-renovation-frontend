import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, Repeat, UserPlus, Users } from "lucide-react";

import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";
import useProjectMembers from "@/hooks/useProjectMembers";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialForm = {
  title: "",
  description: "",
  priority: "medium",
  deadline: "",
  reminder_at: "",
  assigned_to: "",
  recurring: false,
  recurring_cycle: "monthly",
};

const statusBadgeClass = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const priorityBadgeClass = {
  low: "border-slate-200 bg-slate-100 text-slate-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
};

function memberDisplay(member) {
  if (member?.profile?.full_name) return member.profile.full_name;
  if (member?.profile?.email) return member.profile.email;
  if (member?.invite_email) return member.invite_email;
  if (member?.user_id) return `user:${String(member.user_id).slice(0, 8)}`;
  return "Unknown member";
}

export default function TaskSection({ projectId: projectIdProp }) {
  const { selectedProject } = useProject();
  const projectId = projectIdProp || selectedProject?.id;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(initialForm);

  const [activeMode, setActiveMode] = useState("project");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const {
    members,
    loadingMembers,
    memberError,
    fetchMembers,
    inviteMember,
    setMemberError,
  } = useProjectMembers(projectId);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    fetchTasks(projectId);
    fetchMembers();
  }, [projectId, fetchMembers]);

  const fetchTasks = async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/tasks/${id}`);
      const safeTasks = Array.isArray(res.data?.data) ? res.data.data : [];
      setTasks(safeTasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!projectId) return;

    if (!form.title.trim()) {
      setFormError("Task title is required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await api.post("/tasks", {
        project_id: projectId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        deadline: form.deadline || null,
        reminder_at: form.reminder_at ? new Date(form.reminder_at).toISOString() : null,
        assigned_to: form.assigned_to || null,
        recurring: Boolean(form.recurring),
        recurring_cycle: form.recurring ? form.recurring_cycle : null,
      });

      setForm(initialForm);
      setOpen(false);
      fetchTasks(projectId);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const updateTask = async (taskId, payload) => {
    const previous = tasks;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, ...payload } : task
      )
    );

    try {
      setError("");
      setUpdatingTaskId(taskId);
      await api.patch(`/tasks/${taskId}`, payload);
      await fetchTasks(projectId);
    } catch (err) {
      setTasks(previous);
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setUpdatingTaskId("");
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setMemberError("Invite email is required");
      return;
    }

    try {
      setInviting(true);
      setMemberError("");
      await inviteMember({ invite_email: inviteEmail.trim().toLowerCase() });
      setInviteEmail("");
      fetchMembers();
    } catch (err) {
      setMemberError(err.response?.data?.message || "Failed to invite member");
    } finally {
      setInviting(false);
    }
  };

  const safeMembers = Array.isArray(members) ? members : [];
  const assignableMembers = safeMembers.filter((member) => Boolean(member?.user_id) && (!member?.status || member.status === "accepted"));

  const displayedTasks = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    if (activeMode === "maintenance") {
      return safeTasks.filter((task) => Boolean(task.recurring));
    }
    return safeTasks.filter((task) => !task.recurring);
  }, [activeMode, tasks]);

  if (!projectId) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to manage tasks.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Task & Collaboration Hub</h2>
          <p className="text-sm text-muted-foreground">Assign work, track progress, and manage recurring maintenance tasks.</p>
        </div>
        <Button className="h-10 rounded-xl bg-emerald-600 px-4 text-white hover:bg-emerald-700" onClick={() => setOpen(true)}>
          + New Task
        </Button>
      </div>

      <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Project Members</h3>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="Invite teammate by email"
              className="h-10 rounded-xl"
            />
            <Button className="h-10 rounded-xl" onClick={handleInvite} disabled={inviting}>
              <UserPlus className="h-4 w-4" />
              {inviting ? "Inviting..." : "Invite"}
            </Button>
          </div>

          {loadingMembers && <p className="text-xs text-muted-foreground">Loading members...</p>}
          {memberError && <p className="text-xs text-red-600">{memberError}</p>}

          <div className="flex flex-wrap gap-2">
            {safeMembers.length === 0 && !loadingMembers && (
              <p className="text-xs text-muted-foreground">No members yet. Invite collaborators to assign tasks.</p>
            )}
            {safeMembers.map((member) => (
              <Badge key={member.id} className="border-blue-200 bg-blue-50 text-blue-700">
                {memberDisplay(member)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="inline-flex gap-2 rounded-2xl border bg-[var(--surface)] p-2">
        <button
          type="button"
          onClick={() => setActiveMode("project")}
          className={`h-9 rounded-xl px-3 text-sm font-medium transition ${activeMode === "project" ? "bg-emerald-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`}
        >
          Project Tasks
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("maintenance")}
          className={`inline-flex h-9 items-center gap-1 rounded-xl px-3 text-sm font-medium transition ${activeMode === "maintenance" ? "bg-emerald-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`}
        >
          <Repeat className="h-3.5 w-3.5" />
          Home Maintenance
        </button>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border bg-slate-100" />
          ))}
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && displayedTasks.length === 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
            <ClipboardList className="h-8 w-8 text-slate-400" />
            <p>{activeMode === "maintenance" ? "No recurring maintenance tasks yet." : "No tasks created yet."}</p>
            <p className="text-xs">Create a task to start tracking progress.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {displayedTasks.map((task) => {
          const isUpdating = updatingTaskId === task.id;
          const status = task.status || "pending";
          const priority = task.priority || "medium";
          const assignee = task.assigned_member || assignableMembers.find((member) => member.user_id === task.assigned_to);

          return (
            <Card key={task.id} className="rounded-2xl border bg-[var(--surface)] shadow-sm">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold tracking-tight">{task.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{task.description || "No description"}</p>
                  </div>
                  <Badge className={`capitalize ${priorityBadgeClass[priority] || priorityBadgeClass.medium}`}>
                    {priority}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`capitalize ${statusBadgeClass[status] || statusBadgeClass.pending}`}>
                    {isUpdating ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Updating
                      </span>
                    ) : (
                      status.replace("_", " ")
                    )}
                  </Badge>

                  {task.recurring && (
                    <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                      <Repeat className="mr-1 h-3.5 w-3.5" />
                      {task.recurring_cycle || "monthly"}
                    </Badge>
                  )}

                  <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                    {assignee ? memberDisplay(assignee) : "Unassigned"}
                  </Badge>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                    value={status}
                    disabled={isUpdating}
                    onChange={(event) => updateTask(task.id, { status: event.target.value })}
                  >
                    <option value="pending">pending</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                  </select>

                  <select
                    className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                    value={task.assigned_to || ""}
                    disabled={isUpdating}
                    onChange={(event) => updateTask(task.id, { assigned_to: event.target.value || null })}
                  >
                    <option value="">Unassigned</option>
                    {assignableMembers.map((member) => (
                      <option key={member.id} value={member.user_id}>
                        {memberDisplay(member)}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-muted-foreground">
                  Deadline: {task.deadline || "Not set"} | Reminder: {task.reminder_at ? new Date(task.reminder_at).toLocaleString() : "Not set"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="h-10 rounded-xl"
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="h-10 rounded-xl"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>

              <select
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                value={form.assigned_to}
                onChange={(event) => setForm((prev) => ({ ...prev, assigned_to: event.target.value }))}
              >
                <option value="">Assign later</option>
                {assignableMembers.map((member) => (
                  <option key={member.id} value={member.user_id}>
                    {memberDisplay(member)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              type="date"
              value={form.deadline}
              onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))}
              className="h-10 rounded-xl"
            />

            <Input
              type="datetime-local"
              value={form.reminder_at}
              onChange={(event) => setForm((prev) => ({ ...prev, reminder_at: event.target.value }))}
              className="h-10 rounded-xl"
            />

            <div className="rounded-xl border p-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.recurring}
                  onChange={(event) => setForm((prev) => ({ ...prev, recurring: event.target.checked }))}
                />
                Enable recurring maintenance schedule
              </label>

              {form.recurring && (
                <select
                  className="mt-2 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                  value={form.recurring_cycle}
                  onChange={(event) => setForm((prev) => ({ ...prev, recurring_cycle: event.target.value }))}
                >
                  <option value="monthly">monthly</option>
                  <option value="yearly">yearly</option>
                </select>
              )}
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <Button
              className="h-10 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={createTask}
              disabled={saving}
            >
              {saving ? "Saving..." : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
