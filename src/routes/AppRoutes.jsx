import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "@/layout/DashboardLayout"
import Dashboard from "@/pages/Dashboard"
import ExpenseSection from "@/components/project/ExpenseSection"
import TaskSection from "@/components/project/TaskSection"

export default function AppRoutes() {
  const token = localStorage.getItem("token")

  if (!token) return <Navigate to="/login" />

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskSection />} />
        <Route path="expenses" element={<ExpenseSection />} />
      </Route>
    </Routes>
  )
}