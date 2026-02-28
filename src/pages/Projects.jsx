import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/api/api"

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects")
      setProjects(res.data.data || [])
    } catch (err) {
      console.error("Failed to fetch projects:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your renovation projects
          </p>
        </div>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
          onClick={() => navigate("/dashboard/projects/create")}
        >
          + New Project
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading projects...
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              No renovation projects yet
            </p>

            <Button
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
              onClick={() => navigate("/dashboard/projects/create")}
            >
              + Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Project Grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/dashboard/projects/${project._id}`)}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {project.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Budget</span>
                  <span className="font-medium text-foreground">
                    ₹{project.budget}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : project.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}