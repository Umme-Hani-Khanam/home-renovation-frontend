import { useEffect, useState } from "react"
import api from "@/api/api"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"


export default function Contractors() {
  const [contractors, setContractors] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    specialization: "",
    notes: "",
  })

  useEffect(() => {
    fetchContractors()
  }, [])

  const fetchContractors = async () => {
    try {
      const res = await api.get("/contractors")
      setContractors(res.data.data || [])
    } catch (err) {
      console.error("Contractor fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.phone) return

      if (editing) {
        await api.put(`/contractors/${editing._id}`, form)
      } else {
        await api.post("/contractors", form)
      }

      resetForm()
      fetchContractors()
    } catch (err) {
      console.error("Contractor save error:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contractors/${id}`)
      fetchContractors()
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleEdit = (contractor) => {
    setEditing(contractor)
    setForm(contractor)
    setOpen(true)
  }

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      specialization: "",
      notes: "",
    })
    setEditing(null)
    setOpen(false)
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contractors
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage renovation professionals
          </p>
        </div>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          onClick={() => setOpen(true)}
        >
          + Add Contractor
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-20 text-center text-muted-foreground">
            Loading contractors...
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && contractors.length === 0 && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-20 text-center text-muted-foreground">
            No contractors added yet
          </CardContent>
        </Card>
      )}

      {/* Contractor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {contractors.map((contractor) => (
          <Card
            key={contractor._id}
            className="rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="space-y-4">

              <div>
                <h3 className="text-lg font-semibold">
                  {contractor.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {contractor.specialization}
                </p>
              </div>

              <div className="text-sm space-y-1">
                <p>📞 {contractor.phone}</p>
                <p>📧 {contractor.email}</p>
              </div>

              {contractor.notes && (
                <p className="text-xs text-muted-foreground">
                  {contractor.notes}
                </p>
              )}

              <div className="flex justify-end gap-4 text-sm pt-4">
                <button
                  onClick={() => handleEdit(contractor)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(contractor._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
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
              {editing ? "Edit Contractor" : "Add Contractor"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              placeholder="Specialization (e.g., Electrician)"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
            />

            <Textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />

            <Button
              onClick={handleSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {editing ? "Update Contractor" : "Create Contractor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}