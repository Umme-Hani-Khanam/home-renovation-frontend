import { useEffect, useMemo, useState } from "react";
import { FileBadge2 } from "lucide-react";

import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const initialForm = {
  permit_name: "",
  status: "pending",
  approval_date: "",
};

const permitStatusClass = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function PermitSection() {
  const { selectedProject } = useProject();
  const projectId = selectedProject?.id;

  const [permits, setPermits] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!projectId) {
      setPermits([]);
      return;
    }

    fetchPermits(projectId);
  }, [projectId]);

  const fetchPermits = async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/permits/${id}`);
      const safePermits = Array.isArray(res.data?.data) ? res.data.data : [];
      setPermits(safePermits);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch permits");
      setPermits([]);
    } finally {
      setLoading(false);
    }
  };

  const addPermit = async () => {
    if (!projectId) return;

    if (!form.permit_name.trim()) {
      setError("Permit name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/permits", {
        permit_name: form.permit_name.trim(),
        status: form.status,
        approval_date: form.approval_date || null,
        project_id: projectId,
      });

      setForm(initialForm);
      fetchPermits(projectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add permit");
    } finally {
      setSaving(false);
    }
  };

  const updatePermitStatus = async (permitId, nextStatus) => {
    const previous = permits;

    setPermits((current) =>
      current.map((permit) =>
        permit.id === permitId ? { ...permit, status: nextStatus } : permit
      )
    );

    try {
      setError("");
      await api.patch(`/permits/${permitId}`, { status: nextStatus });
      fetchPermits(projectId);
    } catch (err) {
      setPermits(previous);
      setError(err.response?.data?.message || "Failed to update permit status");
    }
  };

  const filteredPermits = useMemo(() => {
    const safePermits = Array.isArray(permits) ? permits : [];
    if (statusFilter === "all") return safePermits;
    return safePermits.filter((permit) => (permit.status || "pending") === statusFilter);
  }, [permits, statusFilter]);

  if (!projectId) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to manage permits.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Permit Tracker</h2>
          <p className="text-sm text-muted-foreground">Manage approvals and compliance status in one place.</p>
        </div>

        <select
          className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">all statuses</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Permit name"
              value={form.permit_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, permit_name: event.target.value }))
              }
              className="h-10 rounded-xl"
            />
            <select
              className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
            <Input
              type="date"
              value={form.approval_date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, approval_date: event.target.value }))
              }
              className="h-10 rounded-xl"
            />
          </div>
          <Button className="h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={addPermit}>
            {saving ? "Saving..." : "Add Permit"}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl border bg-slate-100" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && filteredPermits.length === 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center text-muted-foreground">
            <FileBadge2 className="h-8 w-8 text-slate-400" />
            <p>No permits found for this filter.</p>
            <p className="text-xs">Add permits to track approval status clearly.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filteredPermits.map((permit) => {
          const status = permit.status || "pending";

          return (
            <Card key={permit.id} className="rounded-2xl border bg-[var(--surface)] shadow-sm">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold tracking-tight">{permit.permit_name}</h3>
                  <p className="text-sm text-muted-foreground">Approval: {permit.approval_date || "Not set"}</p>
                  <Badge className={`capitalize ${permitStatusClass[status] || permitStatusClass.pending}`}>
                    {status}
                  </Badge>
                </div>

                <select
                  className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                  value={status}
                  onChange={(event) => updatePermitStatus(permit.id, event.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
