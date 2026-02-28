import { useEffect, useState } from "react";
import API from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



export default function MaterialsSection({ projectId, refreshAnalytics }) {
  const [materials, setMaterials] = useState([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async () => {
    try {
      const res = await API.get(`/materials/${projectId}`);
      setMaterials(res.data.data || []);
    } catch (error) {
      console.error("Fetch materials error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMaterials();
    }
  }, [projectId]);

  const addMaterial = async () => {
    if (!name || !cost) return;

    try {
      setLoading(true);

      await API.post("/materials", {
        project_id: projectId,
        name,
        estimated_cost: Number(cost),
      });

      setName("");
      setCost("");

      await fetchMaterials();

      if (refreshAnalytics) {
        refreshAnalytics();
      }
    } catch (error) {
      console.error("Add material error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePurchased = async (id, current) => {
    try {
      await API.patch(`/materials/${id}`, {
        purchased: !current,
      });

      fetchMaterials();
    } catch (error) {
      console.error("Toggle error:", error.response?.data || error.message);
    }
  };

  const totalEstimated = materials.reduce(
    (sum, m) => sum + Number(m.estimated_cost || 0),
    0
  );

  return (
    <Card className="mb-8 shadow-lg border">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-xl font-bold">Materials</h3>

        <div className="flex gap-3">
          <Input
            placeholder="Material name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Estimated cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <Button onClick={addMaterial} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>

        <p className="font-semibold text-gray-600">
          Total Estimated Cost: ₹{totalEstimated}
        </p>

        <div className="space-y-3">
          {materials.length === 0 && (
            <p className="text-gray-400 text-sm">
              No materials added yet.
            </p>
          )}

          {materials.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center border rounded-lg p-3 hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{m.estimated_cost}
                </p>
              </div>

              <Button
                variant={m.purchased ? "default" : "secondary"}
                onClick={() => togglePurchased(m.id, m.purchased)}
              >
                {m.purchased ? "Purchased" : "Mark Purchased"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}