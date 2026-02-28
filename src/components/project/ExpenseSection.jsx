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

export default function ExpenseSection() {
  const [expenses, setExpenses] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    title: "",
    amount: "",
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses")
      setExpenses(res.data.data || [])
    } catch (err) {
      console.error("Expense fetch error:", err)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api.put(`/expenses/${editing._id}`, form)
      } else {
        await api.post("/expenses", form)
      }

      setOpen(false)
      setEditing(null)
      setForm({ title: "", amount: "" })
      fetchExpenses()
    } catch (err) {
      console.error("Expense save error:", err)
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/expenses/${id}`)
    fetchExpenses()
  }

  const handleEdit = (expense) => {
    setEditing(expense)
    setForm(expense)
    setOpen(true)
  }

  return (
    <div className="space-y-10">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Expenses
        </h1>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          onClick={() => setOpen(true)}
        >
          + Add Expense
        </Button>
      </div>

      {expenses.length === 0 && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="py-20 text-center text-muted-foreground">
            No expenses recorded
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {expenses.map((expense) => (
          <Card
            key={expense._id}
            className="rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="space-y-4">

              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  {expense.title}
                </h3>

                <span className="text-red-600 font-bold">
                  ₹{expense.amount}
                </span>
              </div>

              <div className="flex justify-end gap-4 text-sm">
                <button
                  onClick={() => handleEdit(expense)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(expense._id)}
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
              {editing ? "Edit Expense" : "Create Expense"}
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
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
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