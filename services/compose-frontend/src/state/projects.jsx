import { createContext, useContext, useMemo, useState } from "react";
import { projects as seedProjects } from "../data/projects.js";

const ProjectsContext = createContext(null);

const statusToneMap = {
  进行中: "ontrack",
  需关注: "risk",
  已暂停: "hold",
  已完成: "ontrack",
};

const healthToneMap = {
  稳定: "leaf",
  健康: "leaf",
  偏紧: "sun",
  延迟: "alert",
  暂停: "muted",
};

const normalizeProject = (project) => ({
  ...project,
  archived: project.archived ?? false,
  archivedAt: project.archivedAt ?? null,
});

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(() =>
    seedProjects.map(normalizeProject)
  );

  const createProject = (payload) => {
    const status = payload.status || "进行中";
    const health = payload.health || "稳定";
    const progress = Number.isFinite(payload.progress) ? payload.progress : 0;
    const next = {
      ...payload,
      status,
      health,
      statusTone: statusToneMap[status] || "ontrack",
      healthTone: healthToneMap[health] || "leaf",
      progress: Math.min(Math.max(progress, 0), 100),
      archived: false,
      archivedAt: null,
    };

    setProjects((prev) => [...prev, next]);
  };

  const updateProject = (code, updates) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.code !== code) {
          return project;
        }

        const next = { ...project, ...updates };
        if (updates.status) {
          next.statusTone = statusToneMap[updates.status] || next.statusTone;
        }
        if (updates.health) {
          next.healthTone = healthToneMap[updates.health] || next.healthTone;
        }
        if (typeof updates.progress !== "undefined") {
          next.progress = Number.isFinite(updates.progress)
            ? Math.min(Math.max(updates.progress, 0), 100)
            : project.progress;
        }

        return next;
      })
    );
  };

  const archiveProject = (code) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.code === code
          ? { ...project, archived: true, archivedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const restoreProject = (code) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.code === code
          ? { ...project, archived: false, archivedAt: null }
          : project
      )
    );
  };

  const deleteProject = (code) => {
    setProjects((prev) => prev.filter((project) => project.code !== code));
  };

  const value = useMemo(
    () => ({
      projects,
      createProject,
      updateProject,
      archiveProject,
      restoreProject,
      deleteProject,
    }),
    [projects]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
}
