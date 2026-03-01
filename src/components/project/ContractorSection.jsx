import { useEffect, useMemo, useState } from "react";
import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialContractor = {
  name: "",
  phone: "",
  email: "",
  role: "",
};

const initialSchedule = {
  contractor_id: "",
  scheduled_date: "",
  note: "",
};

export default function ContractorSection() {
  const { selectedProject } = useProject();
  const projectId = selectedProject?.id;

  const [contractors, setContractors] = useState([]);
  const [contractorForm, setContractorForm] = useState(initialContractor);
  const [scheduleForm, setScheduleForm] = useState(initialSchedule);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!projectId) {
      setContractors([]);
      return;
    }

    fetchContractors(projectId);
  }, [projectId]);

  const fetchContractors = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/contractors?projectId=${id}`);
      setContractors(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch contractors");
      setContractors([]);
    } finally {
      setLoading(false);
    }
  };

  const scheduledCount = useMemo(() => activity.filter((item) => item.type === "scheduled").length, [activity]);

  const addContractor = async () => {
    if (!projectId || !contractorForm.name.trim()) {
      setError("Contractor name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/contractors", {
        name: contractorForm.name.trim(),
        phone: contractorForm.phone.trim() || null,
        email: contractorForm.email.trim() || null,
        role: contractorForm.role.trim() || null,
        project_id: projectId,
      });

      setActivity((prev) => [
        { type: "added", label: `Added ${contractorForm.name.trim()}`, created_at: new Date().toISOString() },
        ...prev,
      ]);

      setContractorForm(initialContractor);
      await fetchContractors(projectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add contractor");
    } finally {
      setSaving(false);
    }
  };

  const scheduleVisit = async () => {
    if (!scheduleForm.contractor_id || !scheduleForm.scheduled_date) {
      setError("Select contractor and date");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/contractors/schedule", {
        contractor_id: scheduleForm.contractor_id,
        scheduled_date: scheduleForm.scheduled_date,
        note: scheduleForm.note.trim() || null,
      });

      const contractor = contractors.find((item) => item.id === scheduleForm.contractor_id);
      setActivity((prev) => [
        {
          type: "scheduled",
          label: `Scheduled ${contractor?.name || "contractor"} on ${new Date(scheduleForm.scheduled_date).toLocaleString()}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      setScheduleForm(initialSchedule);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule contractor");
    } finally {
      setSaving(false);
    }
  };

  if (!projectId) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to manage contractors.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Contractor Activity Overview</h2>
        <p className="text-sm text-muted-foreground">Track contractor onboarding and scheduling activity for this project.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Active Contractors</p><p className="text-2xl font-bold">{contractors.length}</p></CardContent></Card>
        <Card className="rounded-2xl border"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Scheduled Visits</p><p className="text-2xl font-bold">{scheduledCount}</p></CardContent></Card>
        <Card className="rounded-2xl border"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Recent Activities</p><p className="text-2xl font-bold">{activity.length}</p></CardContent></Card>
      </div>

      <Card className="rounded-2xl border">
        <CardContent className="space-y-3 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Name"
              value={contractorForm.name}
              onChange={(event) =>
                setContractorForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <Input
              placeholder="Role"
              value={contractorForm.role}
              onChange={(event) =>
                setContractorForm((prev) => ({ ...prev, role: event.target.value }))
              }
            />
            <Input
              placeholder="Phone"
              value={contractorForm.phone}
              onChange={(event) =>
                setContractorForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
            <Input
              placeholder="Email"
              value={contractorForm.email}
              onChange={(event) =>
                setContractorForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={addContractor} disabled={saving}>
            {saving ? "Saving..." : "Add Contractor"}
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl border bg-slate-100" />
          ))}
        </div>
      )}

      {!loading && contractors.length > 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="space-y-3 p-4">
            <h3 className="font-semibold">Schedule Appointment</h3>
            <select
              className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              value={scheduleForm.contractor_id}
              onChange={(event) =>
                setScheduleForm((prev) => ({ ...prev, contractor_id: event.target.value }))
              }
            >
              <option value="">Select contractor</option>
              {contractors.map((contractor) => (
                <option key={contractor.id} value={contractor.id}>
                  {contractor.name}
                </option>
              ))}
            </select>
            <Input
              type="datetime-local"
              value={scheduleForm.scheduled_date}
              onChange={(event) =>
                setScheduleForm((prev) => ({ ...prev, scheduled_date: event.target.value }))
              }
            />
            <Input
              placeholder="Note"
              value={scheduleForm.note}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, note: event.target.value }))}
            />
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={scheduleVisit} disabled={saving}>
              {saving ? "Scheduling..." : "Schedule"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {contractors.map((contractor) => (
          <Card key={contractor.id} className="rounded-2xl border">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{contractor.name}</p>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700">{contractor.role || "general"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{contractor.phone || "No phone"}</p>
              <p className="text-sm text-muted-foreground">{contractor.email || "No email"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activity.length > 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="space-y-2 p-4">
            <h3 className="font-semibold">Recent Activity</h3>
            {activity.slice(0, 5).map((item, index) => (
              <p key={`${item.created_at}-${index}`} className="text-sm text-muted-foreground">{item.label}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
