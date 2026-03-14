import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

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
import Shopping from "@/pages/Shopping"
import Inspiration from "@/pages/Inspiration"
import ProjectDetails from "@/pages/ProjectDetails"
import ExpenseSection from "@/components/project/ExpenseSection"
import PageTransition from "@/components/shared/PageTransition"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  const location = useLocation()
  const routeScopeKey = location.pathname.startsWith("/dashboard")
    ? "/dashboard"
    : location.pathname

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routeScopeKey}>

        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

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
          <Route path="shopping" element={<Shopping />} />
          <Route path="inspiration" element={<Inspiration />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </AnimatePresence>
  )
}

