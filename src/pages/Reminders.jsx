import { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function Reminders() {
  const [reminders, setReminders] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    title: "",
    dueDate: ""
  })

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    const res = await api.get("/reminders")
    const sorted = (res.data.data || []).sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    )
    setReminders(sorted)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.dueDate) return

    if (editing) {
      await api.put(`/reminders/${editing._id}`, form)
    } else {
      await api.post("/reminders", form)
    }

    reset()
    fetchReminders()
  }

  const handleDelete = async (id) => {
    await api.delete(`/reminders/${id}`)
    fetchReminders()
  }

  const handleEdit = (reminder) => {
    setEditing(reminder)
    setForm(reminder)
    setOpen(true)
  }

  const reset = () => {
    setForm({ title: "", dueDate: "" })
    setEditing(null)
    setOpen(false)
  }

  const isOverdue = (date) =>
    new Date(date) < new Date()

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <Button className="bg-emerald-600 text-white rounded-xl" onClick={() => setOpen(true)}>
          + Add Reminder
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reminders.map(reminder => (
          <Card
            key={reminder._id}
            className={`rounded-2xl border shadow-sm hover:shadow-lg transition ${
              isOverdue(reminder.dueDate)
                ? "border-red-400"
                : ""
            }`}
          >
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-lg">
                {reminder.title}
              </h3>

              <p className={`text-sm ${
                isOverdue(reminder.dueDate)
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}>
                Due: {new Date(reminder.dueDate).toLocaleDateString()}
              </p>

              <div className="flex justify-end gap-4 text-sm">
                <button onClick={() => handleEdit(reminder)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(reminder._id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Reminder title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />

            <Button className="w-full bg-emerald-600 text-white" onClick={handleSubmit}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}