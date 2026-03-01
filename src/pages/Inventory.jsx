import { useEffect, useState } from "react";
import api from "@/api/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialForm = {
  name: "",
  quantity: "",
  unit: "",
  low_stock_threshold: "",
};

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/inventory");
      setItems(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!form.name.trim()) {
      setFormError("Item name is required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await api.post("/inventory", {
        name: form.name.trim(),
        quantity: Number(form.quantity || 0),
        unit: form.unit.trim() || null,
        low_stock_threshold: Number(form.low_stock_threshold || 0),
      });

      setForm(initialForm);
      setOpen(false);
      fetchItems();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add inventory item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track tools and materials you already own.</p>
        </div>

        <Button
          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setOpen(true)}
        >
          + Add Item
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading inventory...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <Card className="rounded-3xl">
          <CardContent className="py-12 text-center text-muted-foreground">
            No inventory items yet.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="rounded-3xl border shadow-sm">
            <CardContent className="space-y-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Quantity: {Number(item.quantity || 0)} {item.unit || "units"}
              </p>
              <p className="text-sm text-muted-foreground">
                Low stock threshold: {Number(item.low_stock_threshold || 0)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Item name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              type="number"
              placeholder="Quantity"
              min="0"
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
            />
            <Input
              placeholder="Unit (pcs, kg, ltr...)"
              value={form.unit}
              onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
            />
            <Input
              type="number"
              min="0"
              placeholder="Low stock threshold"
              value={form.low_stock_threshold}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, low_stock_threshold: event.target.value }))
              }
            />

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <Button
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={addItem}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
