import { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function Inventory() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    location: ""
  })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    const res = await api.get("/inventory")
    setItems(res.data.data || [])
  }

  const handleSubmit = async () => {
    if (!form.name) return

    if (editing) {
      await api.put(`/inventory/${editing._id}`, form)
    } else {
      await api.post("/inventory", form)
    }

    reset()
    fetchItems()
  }

  const handleDelete = async (id) => {
    await api.delete(`/inventory/${id}`)
    fetchItems()
  }

  const handleEdit = (item) => {
    setEditing(item)
    setForm(item)
    setOpen(true)
  }

  const reset = () => {
    setForm({ name: "", quantity: "", location: "" })
    setEditing(null)
    setOpen(false)
  }

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button className="bg-emerald-600 text-white rounded-xl" onClick={() => setOpen(true)}>
          + Add Item
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item._id} className="rounded-2xl border shadow-sm hover:shadow-lg transition">
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>
              <p className="text-sm text-muted-foreground">
                Location: {item.location}
              </p>

              <div className="flex justify-end gap-4 text-sm">
                <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-600">Delete</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Item Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />

            <Input placeholder="Quantity"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })} />

            <Input placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} />

            <Button className="w-full bg-emerald-600 text-white" onClick={handleSubmit}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}