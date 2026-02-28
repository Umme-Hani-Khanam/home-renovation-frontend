import { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function Materials() {
  const [materials, setMaterials] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    name: "",
    estimatedCost: ""
  })

  useEffect(() => { fetchMaterials() }, [])

  const fetchMaterials = async () => {
    const res = await api.get("/materials")
    setMaterials(res.data.data || [])
  }

  const handleSubmit = async () => {
    if (editing) {
      await api.put(`/materials/${editing._id}`, form)
    } else {
      await api.post("/materials", form)
    }
    reset()
    fetchMaterials()
  }

  const handleDelete = async (id) => {
    await api.delete(`/materials/${id}`)
    fetchMaterials()
  }

  const handleEdit = (m) => {
    setEditing(m)
    setForm(m)
    setOpen(true)
  }

  const reset = () => {
    setForm({ name: "", estimatedCost: "" })
    setEditing(null)
    setOpen(false)
  }

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Materials</h1>
        <Button className="bg-emerald-600 text-white rounded-xl" onClick={() => setOpen(true)}>
          + Add Material
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {materials.map(m => (
          <Card key={m._id} className="rounded-2xl border shadow-sm hover:shadow-lg transition">
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-lg">{m.name}</h3>
              <p className="text-sm text-red-600 font-bold">
                ₹{m.estimatedCost}
              </p>

              <div className="flex justify-end gap-4 text-sm">
                <button onClick={() => handleEdit(m)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(m._id)} className="text-red-600">Delete</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Material" : "Add Material"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Material Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />

            <Input placeholder="Estimated Cost"
              value={form.estimatedCost}
              onChange={e => setForm({ ...form, estimatedCost: e.target.value })} />

            <Button className="w-full bg-emerald-600 text-white" onClick={handleSubmit}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}