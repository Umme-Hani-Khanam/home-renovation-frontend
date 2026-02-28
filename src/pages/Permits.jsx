import { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function Permits() {
  const [permits, setPermits] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    title: "",
    status: "pending"
  })

  useEffect(() => { fetchPermits() }, [])

  const fetchPermits = async () => {
    const res = await api.get("/permits")
    setPermits(res.data.data || [])
  }

  const handleSubmit = async () => {
    if (editing) {
      await api.put(`/permits/${editing._id}`, form)
    } else {
      await api.post("/permits", form)
    }
    reset()
    fetchPermits()
  }

  const handleDelete = async (id) => {
    await api.delete(`/permits/${id}`)
    fetchPermits()
  }

  const handleEdit = (p) => {
    setEditing(p)
    setForm(p)
    setOpen(true)
  }

  const reset = () => {
    setForm({ title: "", status: "pending" })
    setEditing(null)
    setOpen(false)
  }

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700"
    if (status === "rejected") return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Permits</h1>
        <Button className="bg-emerald-600 text-white rounded-xl" onClick={() => setOpen(true)}>
          + Add Permit
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {permits.map(p => (
          <Card key={p._id} className="rounded-2xl border shadow-sm hover:shadow-lg transition">
            <CardContent className="space-y-3">
              <h3 className="font-semibold">{p.title}</h3>

              <span className={`px-3 py-1 text-xs rounded-full ${statusColor(p.status)}`}>
                {p.status}
              </span>

              <div className="flex justify-end gap-4 text-sm">
                <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Permit" : "Add Permit"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Permit Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />

            <select
              className="w-full border rounded-md p-2"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <Button className="w-full bg-emerald-600 text-white" onClick={handleSubmit}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}