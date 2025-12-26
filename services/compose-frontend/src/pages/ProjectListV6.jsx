import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ProjectFormModal from "../components/ProjectFormModal.jsx";
import { useProjects } from "../state/projects.jsx";

const statusFilters = ["全部", "进行中", "需关注", "已暂停", "已完成"];
const riskFilters = ["全部", "低风险", "中风险", "高风险"];

const riskToneMap = {
  高风险: "alert",
  中风险: "sun",
  低风险: "leaf",
};

const riskRank = {
  高: 3,
  中: 2,
  低: 1,
};

function getProjectRiskLevel(project) {
  if (!project.risks || project.risks.length === 0) {
    return "低风险";
  }

  const topLevel = project.risks.reduce((current, risk) => {
    if (!current) {
      return risk.level;
    }
    return (riskRank[risk.level] || 0) > (riskRank[current] || 0)
      ? risk.level
      : current;
  }, null);

  if (topLevel === "高") {
    return "高风险";
  }
  if (topLevel === "中") {
    return "中风险";
  }
  return "低风险";
}

export default function ProjectListV6({ search = "", onSearchChange = () => {} }) {
  const { projects, createProject, archiveProject, restoreProject, deleteProject } =
    useProjects();
  const [statusFilter, setStatusFilter] = useState("全部");
  const [riskFilter, setRiskFilter] = useState("全部");
  const [ownerFilter, setOwnerFilter] = useState("全部");
  const [showArchived, setShowArchived] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const ownerFilters = useMemo(() => {
    const owners = projects
      .map((project) => project.owner)
      .filter(Boolean)
      .filter((item, index, list) => list.indexOf(item) === index)
      .sort((a, b) => a.localeCompare(b, "zh-CN"));
    return ["全部", ...owners];
  }, [projects]);

  const baseProjects = useMemo(
    () =>
      projects.filter((project) =>
        showArchived ? project.archived : !project.archived
      ),
    [projects, showArchived]
  );

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return baseProjects.filter((project) => {
      const matchesStatus =
        statusFilter === "全部" || project.status === statusFilter;
      const projectRisk = getProjectRiskLevel(project);
      const matchesRisk = riskFilter === "全部" || projectRisk === riskFilter;
      const matchesOwner =
        ownerFilter === "全部" || project.owner === ownerFilter;
      const matchesSearch =
        keyword.length === 0 ||
        [project.name, project.code, project.owner, project.department, project.desc]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(keyword));

      return matchesStatus && matchesRisk && matchesOwner && matchesSearch;
    });
  }, [baseProjects, ownerFilter, riskFilter, search, statusFilter]);

  const hasActiveFilters =
    statusFilter !== "全部" ||
    riskFilter !== "全部" ||
    ownerFilter !== "全部" ||
    search.trim().length > 0;

  const handleClearFilters = () => {
    setStatusFilter("全部");
    setRiskFilter("全部");
    setOwnerFilter("全部");
    onSearchChange("");
  };

  const handleCreateProject = (payload) => {
    createProject({
      ...payload,
      summary: payload.desc,
      stages: [],
      deliverables: [],
      milestones: [],
      tasks: [],
      risks: [],
      team: [],
    });
    setCreateModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (pendingDelete) {
      deleteProject(pendingDelete.code);
      setPendingDelete(null);
    }
  };

  const archivedCount = projects.filter((project) => project.archived).length;
  const activeCount = projects.length - archivedCount;

  const statusSummary = useMemo(() => {
    const summary = {
      进行中: 0,
      需关注: 0,
      已暂停: 0,
      已完成: 0,
    };
    baseProjects.forEach((project) => {
      if (summary[project.status] !== undefined) {
        summary[project.status] += 1;
      }
    });
    return summary;
  }, [baseProjects]);

  return (
    <section className="v6-page">
      <div className="v6-layout">
        <aside className="v6-panel">
          <div className="v6-panel-actions">
            <button
              className="ghost-button"
              onClick={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? "查看未归档" : "查看已归档"}
            </button>
            <button
              className="primary-button"
              onClick={() => setCreateModalOpen(true)}
            >
              新建项目
            </button>
          </div>
          <div className="v6-search">
            <label className="v6-label" htmlFor="v6-search-input">
              搜索项目
            </label>
            <input
              id="v6-search-input"
              placeholder="搜索名称、负责人、编号"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <div className="v6-filter-block">
            <div className="v6-label">状态</div>
            <div className="v6-chip-group">
              {statusFilters.map((item) => (
                <button
                  key={item}
                  className={`v6-chip ${statusFilter === item ? "active" : ""}`}
                  onClick={() => setStatusFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="v6-filter-block">
            <div className="v6-label">风险</div>
            <div className="v6-chip-group">
              {riskFilters.map((item) => (
                <button
                  key={item}
                  className={`v6-chip ${riskFilter === item ? "active" : ""}`}
                  onClick={() => setRiskFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="v6-filter-block">
            <div className="v6-label">负责人</div>
            <div className="v6-chip-group">
              {ownerFilters.map((item) => (
                <button
                  key={item}
                  className={`v6-chip ${ownerFilter === item ? "active" : ""}`}
                  onClick={() => setOwnerFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters ? (
            <div className="v6-panel-clear">
              <button className="ghost-button" onClick={handleClearFilters}>
                清除筛选
              </button>
            </div>
          ) : null}

          <div className="v6-summary">
            <div className="v6-summary-card">
              <div className="v6-summary-label">活跃项目</div>
              <div className="v6-summary-value">{activeCount}</div>
            </div>
            <div className="v6-summary-card">
              <div className="v6-summary-label">需关注</div>
              <div className="v6-summary-value">{statusSummary.需关注}</div>
            </div>
            <div className="v6-summary-card">
              <div className="v6-summary-label">进行中</div>
              <div className="v6-summary-value">{statusSummary.进行中}</div>
            </div>
            <div className="v6-summary-card">
              <div className="v6-summary-label">已归档</div>
              <div className="v6-summary-value">{archivedCount}</div>
            </div>
          </div>
          <div className="v6-result-count">
            匹配 {filteredProjects.length} / {showArchived ? archivedCount : activeCount}
          </div>
        </aside>

        <div className="v6-list-panel">
          {filteredProjects.length === 0 ? (
            <div className="v6-empty">暂无匹配项目，调整筛选后再试。</div>
          ) : (
            <div className="v6-list">
              {filteredProjects.map((project) => {
                const riskLevel = getProjectRiskLevel(project);
                const riskTone = riskToneMap[riskLevel] || "muted";
                const statusLabel = project.archived ? "已归档" : project.status;
                const statusClass = project.archived
                  ? "status-archived"
                  : `status-${project.statusTone}`;

                return (
                  <article
                    key={project.code}
                    className={`v6-card v6-risk-${riskTone}`}
                  >
                    <div className="v6-card-left">
                      <div className="v6-title-row">
                        <div className="v6-name">{project.name}</div>
                        <div className="v6-code">{project.code}</div>
                      </div>
                      <div className="v6-desc">{project.desc || "暂无描述"}</div>
                      <div className="v6-tags">
                        <span className={`status-pill ${statusClass}`}>{statusLabel}</span>
                        <span className={`risk-pill risk-${riskTone}`}>{riskLevel}</span>
                        {project.department ? (
                          <span className="v6-dept">{project.department}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="v6-card-middle">
                      <div className="v6-meta">
                        <div>
                          <div className="v6-meta-label">负责人</div>
                          <div className="v6-meta-value">{project.owner || "未分配"}</div>
                        </div>
                        <div>
                          <div className="v6-meta-label">截止</div>
                          <div className="v6-meta-value">{project.due || "待定"}</div>
                        </div>
                      </div>
                      <div className="v6-progress">
                        <span>{project.progress}%</span>
                        <div className="progress">
                          <span style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="v6-card-actions">
                      <Link className="secondary-button" to={`/projects/${project.code}`}>
                        详情
                      </Link>
                      {project.archived ? (
                        <button
                          className="ghost-button"
                          onClick={() => restoreProject(project.code)}
                        >
                          恢复
                        </button>
                      ) : (
                        <button
                          className="ghost-button"
                          onClick={() => archiveProject(project.code)}
                        >
                          归档
                        </button>
                      )}
                      <button
                        className="ghost-button danger-ghost"
                        onClick={() => setPendingDelete(project)}
                      >
                        删除
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {createModalOpen ? (
        <ProjectFormModal
          title="新建项目"
          submitLabel="创建"
          existingCodes={projects.map((project) => project.code)}
          onSubmit={handleCreateProject}
          onClose={() => setCreateModalOpen(false)}
        />
      ) : null}
      {pendingDelete ? (
        <ConfirmDialog
          title="确认删除项目？"
          message={`删除后将无法恢复：${pendingDelete.name}`}
          confirmLabel="删除"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
    </section>
  );
}
