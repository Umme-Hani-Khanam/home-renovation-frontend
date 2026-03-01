import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { ThemeProvider } from "@/context/ThemeContext"
import { ProjectProvider } from "./context/ProjectContext"
import "@/styles/globals.css"
ReactDOM.createRoot(document.getElementById("root")).render(
 

<ThemeProvider>
  <ProjectProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ProjectProvider>
</ThemeProvider>
)