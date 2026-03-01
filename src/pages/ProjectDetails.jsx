import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderKanban, Sparkles } from "lucide-react";

import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";
import ProjectOverviewSection from "@/components/project/ProjectOverviewSection";
import ExpenseSection from "@/components/project/ExpenseSection";
import ShoppingSection from "@/components/project/ShoppingSection";
import PhotoSection from "@/components/project/PhotoSection";
import ContractorSection from "@/components/project/ContractorSection";
import PermitSection from "@/components/project/PermitSection";
import InventorySection from "@/components/project/InventorySection";
import ReminderSection from "@/components/project/ReminderSection";
import InspirationSection from "@/components/project/InspirationSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tabs = [
  { key: "overview", label: "Overview", component: ProjectOverviewSection },
  { key: "expenses", label: "Expenses", component: ExpenseSection },
  { key: "shopping", label: "Shopping", component: ShoppingSection },
  { key: "photos", label: "Photos", component: PhotoSection },
  { key: "contractors", label: "Contractors", component: ContractorSection },
  { key: "permits", label: "Permits", component: PermitSection },
  { key: "inventory", label: "Inventory", component: InventorySection },
  { key: "reminders", label: "Reminders", component: ReminderSection },
  { key: "inspiration", label: "Inspiration", component: InspirationSection },
];

const projectStatusStyles = {
  planning: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  on_hold: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProject, setSelectedProject } = useProject();

  const [activeTab, setActiveTab] = useState("overview");
  const [syncing, setSyncing] = useState(true);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    let mounted = true;

    const syncUrlProjectIntoContext = async () => {
      if (!id) {
        if (mounted) {
          setSyncing(false);
          setSyncError("No project id found in URL");
        }
        return;
      }

      if (selectedProject?.id === id) {
        if (mounted) {
          setSyncing(false);
          setSyncError("");
        }
        return;
      }

      try {
        if (mounted) {
          setSyncing(true);
          setSyncError("");
        }

        const res = await api.get("/projects");
        const projects = Array.isArray(res.data?.data) ? res.data.data : [];
        const match = projects.find((project) => project.id === id) || null;

        if (!mounted) return;

        if (!match) {
          setSelectedProject(null);
          setSyncError("Project not found");
          setSyncing(false);
          return;
        }

        setSelectedProject(match);
        setSyncing(false);
      } catch (err) {
        if (!mounted) return;

        setSyncError(err.response?.data?.message || "Failed to load project details");
        setSyncing(false);
      }
    };

    syncUrlProjectIntoContext();

    return () => {
      mounted = false;
    };
  }, [id, selectedProject?.id, setSelectedProject]);

  useEffect(() => {
    if (!selectedProject?.id || selectedProject.id === id) return;
    navigate(`/dashboard/projects/${selectedProject.id}`, { replace: true });
  }, [selectedProject?.id, id, navigate]);

  const projectStatusClass = useMemo(() => {
    const status = (selectedProject?.status || "planning").toLowerCase();
    return projectStatusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200";
  }, [selectedProject?.status]);

  const activeTabEntry = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const ActiveComponent = activeTabEntry.component;

  if (syncing) {
    return (
      <Card className="rounded-3xl border bg-[var(--surface)]">
        <CardContent className="py-10 text-center text-muted-foreground">
          Loading project workspace...
        </CardContent>
      </Card>
    );
  }

  if (!selectedProject) {
    return (
      <Card className="rounded-3xl border">
        <CardContent className="py-12 text-center text-muted-foreground">
          {syncError || "Select a project to open workspace."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Card className="rounded-3xl border bg-[var(--surface)] shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <FolderKanban className="h-4 w-4" />
              Project Workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{selectedProject.name}</h1>
            <p className="text-sm text-muted-foreground">Use focused tabs to manage the project without long scrolling.</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`capitalize ${projectStatusClass}`}>
              {selectedProject.status || "planning"}
            </Badge>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              SaaS Workspace
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="custom-scrollbar overflow-x-auto">
        <div className="inline-flex min-w-full gap-2 rounded-2xl border bg-[var(--surface)] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-10 rounded-xl px-4 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white"
                  : "text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-[var(--surface)] p-5 shadow-sm">
        <ActiveComponent projectId={selectedProject.id} />
      </div>
    </div>
  );
}
