import { createContext, useContext, useMemo, useState } from "react";

const ProjectContext = createContext();

function readStoredProject() {
  try {
    const raw = localStorage.getItem("selectedProject");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ProjectProvider({ children }) {
  const [selectedProject, setSelectedProjectState] = useState(readStoredProject);

  const setSelectedProject = (project) => {
    setSelectedProjectState(project);

    if (!project) {
      localStorage.removeItem("selectedProject");
      return;
    }

    localStorage.setItem("selectedProject", JSON.stringify(project));
  };

  const value = useMemo(
    () => ({ selectedProject, setSelectedProject }),
    [selectedProject]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export const useProject = () => useContext(ProjectContext);
