import { useMemo, useState } from "react";
import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function truncateText(text, max = 500) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export default function InspirationSection() {
  const { selectedProject } = useProject();

  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const projectName = selectedProject?.name || "";

  const generate = async () => {
    if (!projectName) {
      setError("Select a project before generating inspiration");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/inspiration", {
        project_name: projectName,
        description: description.trim() || undefined,
        budget: budget ? Number(budget) : undefined,
      });

      setResult(res.data?.data || "");
      setExpanded(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate inspiration");
    } finally {
      setLoading(false);
    }
  };

  const displayResult = useMemo(() => {
    if (expanded) return result;
    return truncateText(result, 650);
  }, [expanded, result]);

  if (!selectedProject) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to generate inspiration.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-lg font-semibold">AI Inspiration Studio</h2>

      <Input value={projectName} disabled />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Describe style, scope, and constraints"
        className="min-h-28 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm"
      />

      <Input
        type="number"
        min="0"
        placeholder="Budget (optional)"
        value={budget}
        onChange={(event) => setBudget(event.target.value)}
      />

      <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Ideas"}
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
          <p className="whitespace-pre-line text-sm leading-relaxed">{displayResult}</p>
          {result.length > 650 && (
            <button
              type="button"
              className="text-xs font-medium text-emerald-700 hover:underline"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Show less" : "Read full inspiration"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
