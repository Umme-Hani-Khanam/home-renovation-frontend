import { useState } from "react";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function CreateProjectDialog({ refresh }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      if (!title.trim() || !budget.trim()) {
        alert("Title and budget are required");
        return;
      }

      setLoading(true);

      await API.post("/projects", {
        title: title.trim(),
        budget: Number(budget),   // 🔥 force number
      });

      setTitle("");
      setBudget("");
      setOpen(false);
      refresh();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-700 hover:bg-green-800">
          + New Project
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter project details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <Button
            className="w-full bg-green-700 hover:bg-green-800"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}