import { useEffect, useState } from "react";
import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";

export default function ProjectSelector({ className = "", required = false }) {
  const { selectedProject, setSelectedProject } = useProject();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get("/projects");
        const items = res.data?.data || [];

        if (!isMounted) return;

        setProjects(items);

        if (required && items.length > 0 && !selectedProject) {
          setSelectedProject(items[0]);
        }

        if (
          selectedProject &&
          !items.some((project) => project.id === selectedProject.id)
        ) {
          setSelectedProject(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to load projects");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [required, selectedProject, setSelectedProject]);

  const onProjectChange = (event) => {
    const nextId = event.target.value;
    const match = projects.find((project) => project.id === nextId) || null;
    setSelectedProject(match);
  };

  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-muted-foreground">
        Project
      </label>
      <select
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        value={selectedProject?.id || ""}
        onChange={onProjectChange}
        disabled={loading || projects.length === 0}
      >
        <option value="">{loading ? "Loading projects..." : "Select project"}</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
