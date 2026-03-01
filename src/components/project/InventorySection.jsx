import { useEffect, useState } from "react";
import api from "@/api/api";

import { Card, CardContent } from "@/components/ui/card";

export default function InventorySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/inventory");
      setItems(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading inventory...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (!items.length) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-8 text-center text-muted-foreground">No inventory items found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl border">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">
              {Number(item.quantity || 0)} {item.unit || "units"}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
