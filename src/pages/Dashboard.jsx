import { useEffect, useState } from "react"
import api from "@/api/api"
import BudgetPie from "@/components/BudgetPie"
import { Textarea } from "@/components/ui/textarea"
export default function Dashboard() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await api.get("/dashboard/summary")
    setSummary(res.data.data)
  }

  if (!summary) return <div>Loading...</div>

  return (
    <div className="space-y-12">

      <h1 className="text-3xl font-bold tracking-tight">
        Renovation Analytics
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Projects" value={summary.totalProjects} />
        <Stat title="Active" value={summary.activeProjects} />
        <Stat title="Completed" value={summary.completedProjects} />
        <Stat title="Overdue Tasks" value={summary.overdueTasks} />
      </div>

      {/* Budget Section */}
      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Budget Distribution
          </h2>

          <BudgetPie
            spent={summary.totalSpent}
            total={summary.totalBudget}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Financial Overview
          </h2>

          <div className="space-y-4 text-sm">
            <p>Total Budget: ₹{summary.totalBudget}</p>
            <p>Total Spent: ₹{summary.totalSpent}</p>
            <p>Remaining: ₹{summary.totalBudget - summary.totalSpent}</p>
          </div>
        </div>

      </div>

    </div>
  )
}

function Stat({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  )
}