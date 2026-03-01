import { useEffect, useMemo, useState } from "react";
import { FileBadge2 } from "lucide-react";

import api from "@/api/api";

import { useProject } from "@/context/ProjectContext";
import ProjectSelector from "@/components/project/ProjectSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function Permits() {
  const { selectedProject } = useProject();

  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!selectedProject?.id) {
      setPermits([]);
      return;
    }
    fetchPermits(selectedProject.id);
  }, [selectedProject?.id]);

  const fetchPermits = async (projectId) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/permits/${projectId}`);
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
    if (!selectedProject?.id) return;

    if (!form.permit_name.trim()) {
      setFormError("Permit name is required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await api.post("/permits", {
        permit_name: form.permit_name.trim(),
        status: form.status,
        approval_date: form.approval_date || null,
        project_id: selectedProject.id,
      });

      setForm(initialForm);
      setOpen(false);
      fetchPermits(selectedProject.id);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add permit");
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
      const patchRes = await api.patch(`/permits/${permitId}`, { status: nextStatus });
      const payload = patchRes.data?.data;
      const updatedPermit = Array.isArray(payload) ? payload[0] : payload;

      if (updatedPermit?.id) {
        setPermits((current) =>
          current.map((permit) =>
            permit.id === updatedPermit.id ? { ...permit, ...updatedPermit } : permit
          )
        );
      } else if (selectedProject?.id) {
        fetchPermits(selectedProject.id);
      }
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

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permits</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track permit approvals and compliance status.</p>
        </div>

        <Button
          className="h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setOpen(true)}
          disabled={!selectedProject}
        >
          + Add Permit
        </Button>
      </div>

      <ProjectSelector required />

      <div className="flex justify-end">
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

      {loading && (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-3xl border bg-slate-100" />
          ))}
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {selectedProject && !loading && filteredPermits.length === 0 && (
        <Card className="rounded-3xl">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <FileBadge2 className="h-8 w-8 text-slate-400" />
            <p>No permits found for this filter.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {filteredPermits.map((permit) => {
          const status = permit.status || "pending";

          return (
            <Card key={permit.id} className="rounded-3xl border bg-[var(--surface)] shadow-sm">
              <CardContent className="space-y-3 p-5">
                <h3 className="text-lg font-semibold tracking-tight">{permit.permit_name}</h3>

                <div className="flex items-center justify-between gap-3">
                  <Badge className={`capitalize ${permitStatusClass[status] || permitStatusClass.pending}`}>
                    {status}
                  </Badge>
                  <select
                    className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                    value={status}
                    onChange={(event) => updatePermitStatus(permit.id, event.target.value)}
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>

                <p className="text-sm text-muted-foreground">
                  Approval date: {permit.approval_date || "Not set"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Permit</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Permit name"
              value={form.permit_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, permit_name: event.target.value }))
              }
              className="h-10 rounded-xl"
            />

            <select
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
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

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <Button
              className="h-10 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={addPermit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Permit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

