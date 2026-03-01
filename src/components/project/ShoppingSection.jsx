import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";

import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ShoppingSection() {
  const { selectedProject } = useProject();
  const projectId = selectedProject?.id;

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setItems([]);
      return;
    }

    fetchItems(projectId);
  }, [projectId]);

  const fetchItems = async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/shopping/${id}`);
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch shopping items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!projectId) return;

    if (!itemName.trim()) {
      setError("Item name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/shopping", {
        project_id: projectId,
        item_name: itemName.trim(),
        estimated_cost: Number(estimatedCost || 0),
      });

      setItemName("");
      setEstimatedCost("");
      await fetchItems(projectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const togglePurchased = async (item) => {
    try {
      await api.patch(`/shopping/${item.id}`, {
        purchased: !item.purchased,
        actual_cost: item.actual_cost ?? item.estimated_cost ?? 0,
      });
      await fetchItems(projectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
    }
  };

  const safeItems = Array.isArray(items) ? items : [];

  const estimatedTotal = useMemo(
    () => safeItems.reduce((sum, item) => sum + Number(item?.estimated_cost || 0), 0),
    [safeItems]
  );

  const actualTotal = useMemo(
    () => safeItems
      .filter((item) => Boolean(item?.purchased))
      .reduce((sum, item) => sum + Number(item?.actual_cost || item?.estimated_cost || 0), 0),
    [safeItems]
  );

  const completionPercentage = useMemo(() => {
    if (estimatedTotal <= 0) return 0;
    return Math.min(100, Math.round((actualTotal / estimatedTotal) * 100));
  }, [actualTotal, estimatedTotal]);

  const isOverBudget = estimatedTotal > 0 && actualTotal > estimatedTotal;

  if (!projectId) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to manage shopping items.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Shopping List</h2>
        <p className="text-sm text-muted-foreground">Track material purchases and estimated costs.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="rounded-2xl border">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Estimated Total</p>
            <p className="text-lg font-semibold">INR {estimatedTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className={`rounded-2xl border ${isOverBudget ? "border-rose-300" : ""}`}>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Actual Total (Purchased)</p>
            <p className={`text-lg font-semibold ${isOverBudget ? "text-rose-700" : ""}`}>INR {actualTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Completion</p>
            <p className="text-lg font-semibold">{completionPercentage}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <Input
            placeholder="Item name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            className="h-10 rounded-xl sm:col-span-2"
          />
          <Input
            type="number"
            min="0"
            placeholder="Estimated cost"
            value={estimatedCost}
            onChange={(event) => setEstimatedCost(event.target.value)}
            className="h-10 rounded-xl"
          />
          <Button className="h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 sm:col-span-3" onClick={addItem}>
            {saving ? "Adding..." : "Add Item"}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl border bg-slate-100" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && safeItems.length === 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center text-muted-foreground">
            <ShoppingCart className="h-8 w-8 text-slate-400" />
            <p>No shopping items.</p>
            <p className="text-xs">Add items to keep your purchases organized.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {safeItems.map((item) => (
          <Card key={item.id} className="rounded-2xl border bg-[var(--surface)] shadow-sm">
            <CardContent className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className={item.purchased ? "font-medium text-muted-foreground line-through" : "font-medium"}>
                  {item.item_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated: INR {Number(item.estimated_cost || 0).toLocaleString()}
                </p>
                <Badge
                  className={
                    item.purchased
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  {item.purchased ? (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Purchased
                    </span>
                  ) : (
                    "Pending Purchase"
                  )}
                </Badge>
              </div>
              <Button
                variant={item.purchased ? "outline" : "default"}
                className={item.purchased ? "h-10 rounded-xl" : "h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"}
                onClick={() => togglePurchased(item)}
              >
                {item.purchased ? "Mark Unpurchased" : "Mark Purchased"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
