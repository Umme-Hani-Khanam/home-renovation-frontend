// c:\Users\Umme Hani Khanam\OneDrive\Desktop\Projects\home-renovation-frontend\src\components\project\ExpenseSection.jsx
import { useEffect, useState } from "react";
import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialForm = {
  title: "",
  category: "",
  amount: "",
};

export default function ExpenseSection() {
  const { selectedProject } = useProject();
  const projectId = selectedProject?.id;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!projectId) {
      setExpenses([]);
      return;
    }

    fetchExpenses(projectId);
  }, [projectId]);

  const fetchExpenses = async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/expenses/${id}`);
      setExpenses(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!projectId) return;

    if (!form.title.trim()) {
      setFormError("Expense title is required");
      return;
    }

    if (form.amount === "" || Number(form.amount) < 0) {
      setFormError("Valid amount is required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await api.post("/expenses", {
        project_id: projectId,
        title: form.title.trim(),
        category: form.category.trim() || null,
        amount: Number(form.amount),
      });

      setForm(initialForm);
      setOpen(false);
      fetchExpenses(projectId);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses(projectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense");
    }
  };

  if (!projectId) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to manage expenses.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setOpen(true)}>
          + Add Expense
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading expenses...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && expenses.length === 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="py-10 text-center text-muted-foreground">
            No expenses recorded yet.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {expenses.map((expense) => (
          <Card key={expense.id} className="rounded-2xl border">
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">{expense.title}</h3>
                <span className="font-semibold text-red-600">
                  INR {Number(expense.amount || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{expense.category || "Uncategorized"}</p>
              <button className="text-sm text-red-600" onClick={() => deleteExpense(expense.id)}>
                Delete
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            />
            <Input
              type="number"
              min="0"
              placeholder="Amount"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            />

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <Button
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={addExpense}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
