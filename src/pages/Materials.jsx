import { useEffect, useMemo, useState } from "react";
import { Boxes, Sparkles } from "lucide-react";

import api from "@/api/api";

import { useProject } from "@/context/ProjectContext";
import ProjectSelector from "@/components/project/ProjectSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Materials() {
  const { selectedProject } = useProject();

  const [materials, setMaterials] = useState([]);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProject?.id) {
      setMaterials([]);
      setShoppingItems([]);
      return;
    }

    fetchMaterials(selectedProject.id);
    fetchShoppingInsights(selectedProject.id);
  }, [selectedProject?.id]);

  const fetchMaterials = async (projectId) => {
    try {
      const res = await api.get(`/materials/${projectId}`);
      setMaterials(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setMaterials([]);
    }
  };

  const fetchShoppingInsights = async (projectId) => {
    try {
      setLoadingInsights(true);
      const res = await api.get(`/shopping/${projectId}`);
      setShoppingItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setShoppingItems([]);
    } finally {
      setLoadingInsights(false);
    }
  };

  const refreshTotals = async (projectId) => {
    await Promise.all([fetchMaterials(projectId), fetchShoppingInsights(projectId)]);
  };

  const generateMaterials = async () => {
    if (!selectedProject?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.post(`/materials/auto/${selectedProject.id}`);
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setMaterials(data);
      await fetchShoppingInsights(selectedProject.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate materials");
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const estimatedTotal = useMemo(
    () => (Array.isArray(materials) ? materials : []).reduce((sum, item) => sum + Number(item?.estimated_cost || 0), 0),
    [materials]
  );

  const purchasedShoppingItems = useMemo(
    () => (Array.isArray(shoppingItems) ? shoppingItems : []).filter((item) => Boolean(item?.purchased)),
    [shoppingItems]
  );

  const actualTotal = useMemo(
    () => purchasedShoppingItems.reduce((sum, item) => sum + Number(item?.actual_cost || item?.estimated_cost || 0), 0),
    [purchasedShoppingItems]
  );

  const completionPercentage = useMemo(() => {
    if (estimatedTotal <= 0) return 0;
    return Math.min(100, Math.round((actualTotal / estimatedTotal) * 100));
  }, [actualTotal, estimatedTotal]);

  const isOverBudget = estimatedTotal > 0 && actualTotal > estimatedTotal;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate an automatic materials estimate for your selected project.
          </p>
        </div>

        <Button
          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={generateMaterials}
          disabled={!selectedProject || loading}
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating Estimate..." : "Generate Materials Estimate"}
        </Button>
      </div>

      <ProjectSelector required />

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Estimated Total</p>
            <p className="text-xl font-bold">INR {estimatedTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className={`rounded-2xl border ${isOverBudget ? "border-rose-300" : ""}`}>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Actual Total (Purchased)</p>
            <p className={`text-xl font-bold ${isOverBudget ? "text-rose-700" : ""}`}>INR {actualTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Completion %</p>
            <p className="text-xl font-bold">{completionPercentage}%</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Budget Status</p>
            <p className={`text-sm font-semibold ${isOverBudget ? "text-rose-700" : "text-emerald-700"}`}>
              {isOverBudget ? "Over budget" : "Within budget"}
            </p>
          </CardContent>
        </Card>
      </div>

      {(loading || loadingInsights) && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-3xl border bg-slate-100" />
          ))}
        </div>
      )}

      {!loading && materials.length === 0 && (
        <Card className="rounded-3xl">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Boxes className="h-8 w-8 text-slate-400" />
            <p>Generate materials to see estimates for this project.</p>
          </CardContent>
        </Card>
      )}

      {!loading && materials.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.isArray(materials) && materials.map((item, index) => (
            <Card key={`${item?.name || "material"}-${index}`} className="rounded-3xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="space-y-2 p-5">
                <h3 className="text-lg font-semibold tracking-tight">{item?.name || "Unnamed material"}</h3>
                <p className="text-sm text-muted-foreground">
                  Estimated cost: INR {Number(item?.estimated_cost || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button variant="outline" className="rounded-xl" onClick={() => refreshTotals(selectedProject?.id)} disabled={!selectedProject?.id || loadingInsights}>
        {loadingInsights ? "Refreshing..." : "Recalculate Totals"}
      </Button>
    </div>
  );
}
