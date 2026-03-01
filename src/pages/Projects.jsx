import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialForm = {
  name: "",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
  total_budget: "",
};

export default function Projects() {
  const navigate = useNavigate();
  const { setSelectedProject } = useProject();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/projects");
      setProjects(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openProject = (project) => {
    setSelectedProject(project);
    navigate(`/dashboard/projects/${project.id}`);
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Project name is required";
    if (form.total_budget === "" || Number(form.total_budget) < 0) {
      return "Valid total budget is required";
    }
    if (form.start_date && form.end_date && form.start_date > form.end_date) {
      return "End date must be after start date";
    }
    return "";
  };

  const handleCreateProject = async () => {
    const message = validateForm();
    if (message) {
      setFormError(message);
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await api.post("/projects", {
        name: form.name.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        total_budget: Number(form.total_budget),
      });

      setForm(initialForm);
      setOpen(false);
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const statusStyle = (status) => {
    if (status === "completed") return "bg-emerald-100 text-emerald-700";
    if (status === "in_progress") return "bg-amber-100 text-amber-700";
    if (status === "on_hold") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all renovation projects.</p>
        </div>

        <Button
          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setOpen(true)}
        >
          + New Project
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading projects...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <Card className="rounded-3xl">
          <CardContent className="py-14 text-center text-muted-foreground">
            No projects found. Create your first renovation project.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <motion.div key={project.id} whileHover={{ y: -6 }}>
            <Card
              className="cursor-pointer rounded-3xl border shadow-sm transition hover:shadow-lg"
              onClick={() => openProject(project)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-semibold">
                    INR {Number(project.total_budget || 0).toLocaleString()}
                  </span>
                </div>

                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                    project.status
                  )}`}
                >
                  {(project.status || "planning").replace("_", " ")}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              placeholder="Project name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            />
            <Input
              type="number"
              min="0"
              placeholder="Total budget"
              value={form.total_budget}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, total_budget: event.target.value }))
              }
            />
            <Input
              type="date"
              value={form.start_date}
              onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
            />
            <Input
              type="date"
              value={form.end_date}
              onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="sm:col-span-2"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <Button
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={saving}
            onClick={handleCreateProject}
          >
            {saving ? "Creating..." : "Create Project"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
