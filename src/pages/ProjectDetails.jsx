import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/api/axios";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [contractorName, setContractorName] = useState("");
  const [contractorPhone, setContractorPhone] = useState("");

  const [materialName, setMaterialName] = useState("");
  const [materialCost, setMaterialCost] = useState("");

  useEffect(() => {
    fetchProject();
    fetchAnalytics();
    fetchContractors();
    fetchMaterials();
  }, []);

  const fetchProject = async () => {
    const res = await API.get("/projects");
    const current = res.data.data.find((p) => p.id === id);
    setProject(current);
  };

  const fetchAnalytics = async () => {
    const res = await API.get(`/projects/${id}/analytics`);
    setAnalytics(res.data.data);
  };

  const fetchContractors = async () => {
    const res = await API.get(`/contractors/${id}`);
    setContractors(res.data.data || []);
  };

  const fetchMaterials = async () => {
    const res = await API.get(`/materials/${id}`);
    setMaterials(res.data.data || []);
  };

  const addContractor = async () => {
    if (!contractorName) return;

    await API.post("/contractors", {
      project_id: id,
      name: contractorName,
      phone: contractorPhone,
    });

    setContractorName("");
    setContractorPhone("");
    fetchContractors();
  };

  const addMaterial = async () => {
    if (!materialName || !materialCost) return;

    await API.post("/materials", {
      project_id: id,
      name: materialName,
      estimated_cost: Number(materialCost),
    });

    setMaterialName("");
    setMaterialCost("");
    fetchMaterials();
    fetchAnalytics();
  };

  if (!project) return null;

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* PROJECT HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {project.name}
          </h2>
          <p className="text-gray-500">
            Total Budget: ₹{project.total_budget}
          </p>
        </div>

        {/* ANALYTICS */}
        {analytics && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">
                Budget Overview
              </h3>

              <p>Spent: ₹{analytics.totalSpent}</p>
              <p>Remaining: ₹{analytics.remainingBudget}</p>

              <div className="h-3 bg-gray-200 rounded-full">
                <div
                  className={`h-3 rounded-full ${
                    analytics.budgetUsedPercentage > 90
                      ? "bg-red-500"
                      : "bg-emerald-600"
                  }`}
                  style={{
                    width: `${analytics.budgetUsedPercentage}%`,
                  }}
                />
              </div>

              <p>{analytics.budgetUsedPercentage}% used</p>
            </CardContent>
          </Card>
        )}

        {/* CONTRACTORS */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">
              Contractors
            </h3>

            <div className="flex gap-3">
              <Input
                placeholder="Name"
                value={contractorName}
                onChange={(e) =>
                  setContractorName(e.target.value)
                }
              />
              <Input
                placeholder="Phone"
                value={contractorPhone}
                onChange={(e) =>
                  setContractorPhone(e.target.value)
                }
              />
              <Button onClick={addContractor}>
                Add
              </Button>
            </div>

            {contractors.map((c) => (
              <div
                key={c.id}
                className="flex justify-between border-b py-2"
              >
                <span>{c.name}</span>
                <span className="text-gray-500">
                  {c.phone}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MATERIALS */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">
              Materials
            </h3>

            <div className="flex gap-3">
              <Input
                placeholder="Material"
                value={materialName}
                onChange={(e) =>
                  setMaterialName(e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Estimated Cost"
                value={materialCost}
                onChange={(e) =>
                  setMaterialCost(e.target.value)
                }
              />
              <Button onClick={addMaterial}>
                Add
              </Button>
            </div>

            {materials.map((m) => (
              <div
                key={m.id}
                className="flex justify-between border-b py-2"
              >
                <span>{m.name}</span>
                <span>₹{m.estimated_cost}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}