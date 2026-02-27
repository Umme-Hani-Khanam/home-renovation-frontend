import { useState } from "react";
import API from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateProjectDialog({ refresh }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!name.trim()) {
      alert("Project name required");
      return;
    }

    if (!totalBudget || Number(totalBudget) <= 0) {
      alert("Total budget required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/projects", {
        name: name.trim(),
        total_budget: Number(totalBudget),
      });

      setName("");
      setTotalBudget("");
      setOpen(false);

      if (refresh) refresh();
    } catch (error) {
      console.error(
        "Create project error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          + New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Total Budget"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
          />

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleCreateProject}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}