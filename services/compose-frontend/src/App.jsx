import { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import ProjectFlowApple from "./pages/ProjectFlowApple.jsx";
import ProjectList from "./pages/ProjectList.jsx";
import Placeholder from "./pages/Placeholder.jsx";

const navItems = [
  { label: "项目管理", to: "/" },
  { label: "时间线", to: "/timeline" },
  { label: "资源", to: "/resources" },
  { label: "报告", to: "/reports" },
  { label: "设置", to: "/settings" },
];

function Layout({ children, searchValue, onSearchChange }) {
  return (
    <div className="app">
      <div className="bg-orbit orbit-one" />
      <div className="bg-orbit orbit-two" />

      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CS</span>
          <div>
            <div className="brand-title">Compose Studio</div>
            <div className="brand-subtitle">项目控制台</div>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-indicator" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="sidebar-card-title">季度重点</div>
          <div className="sidebar-card-body">
            对齐产品、运营与市场的发布节奏。
          </div>
          <div className="sidebar-card-footer">
            <span>Q3 视野</span>
            <button className="ghost-button">查看简报</button>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="search">
            <input
              aria-label="搜索项目"
              placeholder="搜索项目、团队或标签"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
          <div className="topbar-actions">
            <button className="ghost-button">导出</button>
            <button className="primary-button">新建项目</button>
            <div className="profile">
              <div className="avatar">AC</div>
              <div>
                <div className="profile-name">陈 安瑞</div>
                <div className="profile-role">组合负责人</div>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <BrowserRouter>
      <Layout searchValue={searchValue} onSearchChange={setSearchValue}>
        <Routes>
          <Route
            path="/"
            element={
              <ProjectList
                search={searchValue}
                onSearchChange={setSearchValue}
              />
            }
          />
          <Route path="/projects/:id" element={<ProjectFlowApple />} />
          <Route
            path="/timeline"
            element={
              <Placeholder
                title="时间线"
                subtitle="项目节奏与关键依赖"
                note="用于展示跨项目的计划排期、关键路径与里程碑依赖。"
              />
            }
          />
          <Route
            path="/resources"
            element={
              <Placeholder
                title="资源"
                subtitle="人力与资源分配"
                note="用于跟踪团队负载、关键资源冲突与预算分配。"
              />
            }
          />
          <Route
            path="/reports"
            element={
              <Placeholder
                title="报告"
                subtitle="组合洞察与复盘"
                note="用于输出阶段性复盘、趋势变化与风险汇总。"
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Placeholder
                title="设置"
                subtitle="流程与权限"
                note="用于管理权限、通知规则与系统集成。"
              />
            }
          />
          <Route
            path="*"
            element={
              <Placeholder
                title="页面不存在"
                subtitle="返回项目管理"
                note="当前地址没有对应页面，请从左侧导航进入。"
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
