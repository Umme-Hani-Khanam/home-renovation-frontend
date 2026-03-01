import { useEffect, useState } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";

import api from "@/api/api";

import { useProject } from "@/context/ProjectContext";
import ProjectSelector from "@/components/project/ProjectSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Shopping() {
  const { selectedProject } = useProject();

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProject?.id) {
      setItems([]);
      return;
    }

    fetchItems(selectedProject.id);
  }, [selectedProject?.id]);

  const fetchItems = async (projectId) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/shopping/${projectId}`);
      setItems(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch shopping list");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!selectedProject?.id) return;

    if (!newItem.trim()) {
      setError("Item name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/shopping", {
        project_id: selectedProject.id,
        item_name: newItem.trim(),
        estimated_cost: Number(estimatedCost || 0),
      });

      setNewItem("");
      setEstimatedCost("");
      fetchItems(selectedProject.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add shopping item");
    } finally {
      setSaving(false);
    }
  };

  const togglePurchased = async (item) => {
    try {
      setError("");

      await api.patch(`/shopping/${item.id}`, {
        purchased: !item.purchased,
        actual_cost: item.actual_cost ?? item.estimated_cost ?? 0,
      });

      fetchItems(selectedProject.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
    }
  };

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shopping List</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track items to buy and purchased costs.</p>
      </div>

      <ProjectSelector required />

      {selectedProject && (
        <Card className="rounded-3xl border bg-[var(--surface)] shadow-sm">
          <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
            <Input
              placeholder="Item name"
              value={newItem}
              onChange={(event) => setNewItem(event.target.value)}
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
            <Button
              className="h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 sm:col-span-3"
              onClick={addItem}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Item"}
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl border bg-slate-100" />
          ))}
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {selectedProject && !loading && safeItems.length === 0 && (
        <Card className="rounded-3xl">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <ShoppingCart className="h-8 w-8 text-slate-400" />
            <p>No shopping items for this project.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {safeItems.map((item) => (
          <Card key={item.id} className="rounded-2xl border bg-[var(--surface)] shadow-sm">
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`font-medium ${item.purchased ? "line-through text-muted-foreground" : ""}`}>
                  {item.item_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated: INR {Number(item.estimated_cost || 0).toLocaleString()}
                </p>
                <Badge
                  className={
                    item.purchased
                      ? "mt-2 border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "mt-2 border-amber-200 bg-amber-50 text-amber-700"
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
