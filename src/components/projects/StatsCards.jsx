import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ projects }) {
  const totalBudget = projects.reduce(
    (sum, p) => sum + Number(p.budget),
    0
  );

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <h3>Total Projects</h3>
          <p className="text-3xl font-bold">{projects.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3>Total Budget</h3>
          <p className="text-3xl font-bold">₹{totalBudget}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3>Status</h3>
          <p className="text-3xl font-bold text-green-600">Active</p>
        </CardContent>
      </Card>
    </div>
  );
}