import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects.js";

const summary = [
  {
    label: "进行中",
    value: "18",
    note: "含 3 个跨部门项目",
    tone: "accent",
  },
  {
    label: "本周交付",
    value: "5",
    note: "较上周 +1",
    tone: "calm",
  },
  {
    label: "风险提醒",
    value: "3",
    note: "需负责人确认",
    tone: "alert",
  },
  {
    label: "预算消耗",
    value: "62%",
    note: "本季度已使用",
    tone: "sun",
  },
];

const statusFilters = ["全部", "进行中", "需关注", "已暂停", "已完成"];
const riskFilters = ["全部", "低风险", "中风险", "高风险"];
const ownerFilters = ["全部", "Mira", "Satoshi", "Noah", "Avery"];

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

export default function ProjectList({
  search = "",
  onSearchChange = () => {},
}) {
  const [statusFilter, setStatusFilter] = useState("全部");
  const [riskFilter, setRiskFilter] = useState("全部");
  const [ownerFilter, setOwnerFilter] = useState("全部");

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return projects.filter((project) => {
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
  }, [ownerFilter, riskFilter, search, statusFilter]);

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

  return (
    <>
      <section className="hero list-hero">
        <div className="hero-text">
          <div className="hero-eyebrow">项目管理</div>
          <h1>项目列表</h1>
          <p>
            快速掌握各项目状态、负责人和交付节奏，集中处理风险与依赖。
          </p>
          <div className="hero-actions">
            <button className="primary-button">查看关键项目</button>
            <button className="secondary-button">导入项目</button>
          </div>
        </div>
        <div className="hero-card list-card">
          <div className="hero-card-title">本周概览</div>
          <div className="list-card-grid">
            <div>
              <div className="list-card-value">5</div>
              <div className="list-card-label">交付节点</div>
            </div>
            <div>
              <div className="list-card-value">2</div>
              <div className="list-card-label">高风险项目</div>
            </div>
            <div>
              <div className="list-card-value">11</div>
              <div className="list-card-label">更新动态</div>
            </div>
            <div>
              <div className="list-card-value">8</div>
              <div className="list-card-label">待审批变更</div>
            </div>
          </div>
          <div className="hero-card-foot">
            <div>
              <div className="hero-card-label">下一次组合评审</div>
              <div className="hero-card-time">周五 16:00</div>
            </div>
            <button className="ghost-button">准备议程</button>
          </div>
        </div>
      </section>

      <section className="metrics">
        {summary.map((metric, index) => (
          <div
            key={metric.label}
            className={`metric-card tone-${metric.tone} animate`}
            style={{ "--delay": `${index * 0.08}s` }}
          >
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-change">{metric.note}</div>
          </div>
        ))}
      </section>

      <section className="list-toolbar">
        <div>
          <div className="toolbar-title">全部项目</div>
          <div className="toolbar-subtitle">
            显示 {filteredProjects.length} / {projects.length} 个项目 · 最近更新 2 小时前
          </div>
        </div>
        <div className="toolbar-actions">
          {hasActiveFilters ? (
            <button className="ghost-button" onClick={handleClearFilters}>
              清除筛选
            </button>
          ) : null}
          <button className="secondary-button">批量操作</button>
        </div>
      </section>

      <section className="filters">
        <div className="filter-group">
          <div className="filter-label">状态</div>
          <div className="filter-chips">
            {statusFilters.map((item) => (
              <button
                key={item}
                className={`filter-chip ${
                  statusFilter === item ? "active" : ""
                }`}
                onClick={() => setStatusFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-label">风险</div>
          <div className="filter-chips">
            {riskFilters.map((item) => (
              <button
                key={item}
                className={`filter-chip ${
                  riskFilter === item ? "active" : ""
                }`}
                onClick={() => setRiskFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-label">负责人</div>
          <div className="filter-chips">
            {ownerFilters.map((item) => (
              <button
                key={item}
                className={`filter-chip ${
                  ownerFilter === item ? "active" : ""
                }`}
                onClick={() => setOwnerFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <section className="empty-state panel">
          <div className="panel-title">没有匹配的项目</div>
          <div className="panel-subtitle">
            调整筛选或清除条件后再试。
          </div>
          <button className="secondary-button" onClick={handleClearFilters}>
            清除筛选
          </button>
        </section>
      ) : (
        <section className="project-list">
          {filteredProjects.map((project, index) => {
            const riskLevel = getProjectRiskLevel(project);
            const riskTone = riskToneMap[riskLevel] || "muted";

            return (
              <article
                key={project.code}
                className="project-card animate"
                style={{ "--delay": `${index * 0.06}s` }}
              >
                <div className="project-main">
                  <div className="project-title-row">
                    <div>
                      <div className="project-code">{project.code}</div>
                      <h3>{project.name}</h3>
                    </div>
                    <span
                      className={`status-pill status-${project.statusTone}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="project-meta">
                    <span>负责人 {project.owner}</span>
                    <span>截止 {project.due}</span>
                    <span>预算 {project.budget}</span>
                    <span className={`risk-pill risk-${riskTone}`}>
                      {riskLevel}
                    </span>
                  </div>
                  <p className="project-desc">{project.desc}</p>
                </div>
                <div className="project-side">
                  <div className="project-health">
                    <div
                      className={`health-dot tone-${project.healthTone}`}
                    />
                    <div>
                      <div className="health-label">健康度</div>
                      <div className="health-value">{project.health}</div>
                    </div>
                  </div>
                  <div className="project-progress">
                    <div className="progress-label">完成度 {project.progress}%</div>
                    <div className="progress">
                      <span style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <Link
                    className="secondary-button"
                    to={`/projects/${project.code}`}
                  >
                    查看详情
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
