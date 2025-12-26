import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PROJECT_SERVICE_BASE_URL } from "../config.js";

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

const clampProgress = (value) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(value, 0), 100);
};

const normalizeProject = (project) => {
  const status = project.status || "进行中";
  const health = project.health || "稳定";
  const progress = clampProgress(project.progress ?? 0);
  const code = project.code || project.id || "";

  return {
    ...project,
    code,
    name: project.name || project.id || "",
    status,
    health,
    statusTone: statusToneMap[status] || "ontrack",
    healthTone: healthToneMap[health] || "leaf",
    progress,
    archived: project.archived ?? false,
    archivedAt: project.archived_at ?? project.archivedAt ?? null,
    due: project.due ?? "",
    department: project.department ?? "",
    desc: project.desc ?? "",
    risks: project.risks ?? [],
    stages: project.stages ?? [],
    deliverables: project.deliverables ?? [],
    milestones: project.milestones ?? [],
    tasks: project.tasks ?? [],
    team: project.team ?? [],
  };
};

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = PROJECT_SERVICE_BASE_URL.replace(/\/+$/, "");

  const upsertProject = useCallback((item) => {
    const normalized = normalizeProject(item);
    setProjects((prev) => {
      const next = [...prev];
      const index = next.findIndex((project) => project.code === normalized.code);
      if (index >= 0) {
        next[index] = { ...next[index], ...normalized };
        return next;
      }
      next.push(normalized);
      return next;
    });
  }, []);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseUrl}/projects`);
      if (!response.ok) {
        throw new Error("load_failed");
      }
      const payload = await response.json();
      setProjects((payload.items || []).map(normalizeProject));
    } catch (err) {
      setError("项目列表加载失败，请稍后再试");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(
    async (payload) => {
      setError("");
      const status = payload.status || "进行中";
      const health = payload.health || "稳定";
      const progress = clampProgress(payload.progress ?? 0);
      const response = await fetch(`${baseUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: payload.code,
          name: payload.name,
          owner: payload.owner,
          status,
          due: payload.due,
          department: payload.department,
          desc: payload.desc,
          health,
          progress,
        }),
      });
      if (!response.ok) {
        setError("项目创建失败，请稍后重试");
        return;
      }
      const item = await response.json();
      upsertProject(item);
    },
    [baseUrl, upsertProject]
  );

  const updateProject = useCallback(
    async (code, updates) => {
      setError("");
      const {
        code: _code,
        archivedAt: _archivedAt,
        archived_at: _archivedAtRaw,
        statusTone: _statusTone,
        healthTone: _healthTone,
        ...payload
      } = updates || {};
      const response = await fetch(`${baseUrl}/projects/${encodeURIComponent(code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setError("项目更新失败，请稍后重试");
        return;
      }
      const item = await response.json();
      upsertProject(item);
    },
    [baseUrl, upsertProject]
  );

  const archiveProject = useCallback(
    async (code) => {
      await updateProject(code, { archived: true });
    },
    [updateProject]
  );

  const restoreProject = useCallback(
    async (code) => {
      await updateProject(code, { archived: false });
    },
    [updateProject]
  );

  const deleteProject = useCallback(
    async (code) => {
      setError("");
      const response = await fetch(`${baseUrl}/projects/${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setError("项目删除失败，请稍后重试");
        return;
      }
      setProjects((prev) => prev.filter((project) => project.code !== code));
    },
    [baseUrl]
  );

  const value = useMemo(
    () => ({
      projects,
      isLoading,
      error,
      reloadProjects: loadProjects,
      createProject,
      updateProject,
      archiveProject,
      restoreProject,
      deleteProject,
    }),
    [
      projects,
      isLoading,
      error,
      loadProjects,
      createProject,
      updateProject,
      archiveProject,
      restoreProject,
      deleteProject,
    ]
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
