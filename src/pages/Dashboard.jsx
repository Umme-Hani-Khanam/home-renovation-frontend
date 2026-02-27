import { useEffect, useState } from "react";
import API from "@/api/axios";
import AppLayout from "@/components/layout/AppLayout";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
  <AppLayout>
  <div className="flex justify-between items-center mb-10">
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Dashboard
      </h2>
      <p className="text-gray-500 mt-1">
        Overview of your renovation projects
      </p>
    </div>

    <CreateProjectDialog refresh={fetchProjects} />
  </div>

  {/* SUMMARY CARDS */}
  <div className="grid md:grid-cols-3 gap-6 mb-10">
    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-gray-500 text-sm">Total Projects</p>
      <h3 className="text-2xl font-bold text-emerald-600">
        {projects.length}
      </h3>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-gray-500 text-sm">Total Budget</p>
      <h3 className="text-2xl font-bold text-emerald-600">
        ₹
        {projects.reduce(
          (sum, p) => sum + Number(p.total_budget || 0),
          0
        )}
      </h3>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-gray-500 text-sm">Active Projects</p>
      <h3 className="text-2xl font-bold text-emerald-600">
        {
          projects.filter(
            (p) => p.status === "in_progress"
          ).length
        }
      </h3>
    </div>
  </div>

  {projects.length === 0 && (
    <div className="bg-white border rounded-2xl shadow-lg p-14 text-center">
      <h3 className="text-2xl font-semibold mb-2 text-gray-800">
        No Projects Yet
      </h3>
      <p className="text-gray-500 mb-6">
        Start your renovation journey.
      </p>
    </div>
  )}

  {projects.length > 0 && (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => navigate(`/projects/${project.id}`)}
          className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            {project.name}
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Total Budget
          </p>

          <p className="text-2xl font-bold text-emerald-600 mb-4">
            ₹{project.total_budget}
          </p>

          {/* STATIC PROGRESS FOR NOW */}
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-emerald-600 rounded-full"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      ))}
    </div>
  )}
</AppLayout>
  );
}