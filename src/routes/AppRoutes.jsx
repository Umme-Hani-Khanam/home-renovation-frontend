import { Routes, Route, Navigate } from "react-router-dom"

import DashboardLayout from "@/components/layout/DashboardLayout"

import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"

import Dashboard from "@/pages/Dashboard"
import Projects from "@/pages/Projects"
import Tasks from "@/pages/Tasks"
import Contractors from "@/pages/Contractors"
import Inventory from "@/pages/Inventory"
import Materials from "@/pages/Materials"
import Permits from "@/pages/Permits"
import Photos from "@/pages/Photos"
import Reminders from "@/pages/Reminders"
import Shopping from "@/pages/Shopping"
import Inspiration from "@/pages/Inspiration"
import ProjectDetails from "@/pages/ProjectDetails"
import ExpenseSection from "@/components/project/ExpenseSection"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="expenses" element={<ExpenseSection />} />
        <Route path="contractors" element={<Contractors />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="materials" element={<Materials />} />
        <Route path="permits" element={<Permits />} />
        <Route path="photos" element={<Photos />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="shopping" element={<Shopping />} />
        <Route path="inspiration" element={<Inspiration />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}
