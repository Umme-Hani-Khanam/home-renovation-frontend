import { useEffect, useState } from "react";
import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function ExpenseSection({ projectId }) {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const fetchExpenses = async () => {
    const res = await API.get(`/expenses/${projectId}`);
    setExpenses(res.data.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, [projectId]);

  const addExpense = async () => {
    if (!name || !amount) return;

    await API.post("/expenses", {
      project_id: projectId,
      name,
      amount,
    });

    setName("");
    setAmount("");
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const totalSpent = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <Card className="mb-8">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Expenses</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={addExpense}>Add</Button>
        </div>

        <p className="font-semibold">
          Total Spent: ₹{totalSpent}
        </p>

        {expenses.length === 0 && (
          <p className="text-gray-500">No expenses added.</p>
        )}

        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex justify-between items-center border p-3 rounded-md"
          >
            <span>
              {expense.name} - ₹{expense.amount}
            </span>

            <Trash2
              className="h-4 w-4 text-red-500 cursor-pointer"
              onClick={() => deleteExpense(expense.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}