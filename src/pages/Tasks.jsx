import { useEffect, useState } from "react"
import api from "@/api/api"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await api.get("/tasks")
    setTasks(res.data.data || [])
  }

  const handleSubmit = async () => {
    if (editing) {
      await api.put(`/tasks/${editing._id}`, form)
    } else {
      await api.post("/tasks", form)
    }

    setOpen(false)
    setEditing(null)
    setForm({ title: "", description: "", status: "pending" })
    fetchTasks()
  }

  const handleEdit = (task) => {
    setEditing(task)
    setForm(task)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          onClick={() => setOpen(true)}
        >
          + New Task
        </Button>
      </div>

      {tasks.length === 0 && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-20 text-center text-muted-foreground">
            No tasks available
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <Card
            key={task._id}
            className="rounded-2xl border shadow-sm hover:shadow-lg transition"
          >
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">
                {task.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                  {task.status}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Task" : "Create Task"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button
              onClick={handleSubmit}
              className="w-full bg-emerald-600 text-white"
            >
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}