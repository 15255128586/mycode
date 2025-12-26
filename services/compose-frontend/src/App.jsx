import { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import AutoReport from "./pages/AutoReport.jsx";
import MyTodo from "./pages/MyTodo.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import ProjectListV6 from "./pages/ProjectListV6.jsx";
import TaskWorkspace from "./pages/TaskWorkspace.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import { ProjectsProvider } from "./state/projects.jsx";

const navItems = [
  { label: "项目管理", to: "/" },
  { label: "我的待办", to: "/todo" },
  { label: "自动报告", to: "/auto-report" },
];

function Layout({ children }) {
  const location = useLocation();
  const isWorkspace = /^\/projects\/[^/]+\/tasks\/[^/]+/.test(location.pathname);
  const isV6 = location.pathname === "/" || location.pathname.startsWith("/projects-v6");

  return (
    <div
      className={`app${isWorkspace ? " app-workspace" : ""}${
        isV6 ? " app-v6" : ""
      }`}
    >
      <div className="bg-orbit orbit-one" />
      <div className="bg-orbit orbit-two" />

      {!isWorkspace ? (
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
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-indicator" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
      ) : null}

      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <ProjectsProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
          <Route
            path="/"
            element={
              <ProjectListV6
                search={searchValue}
                onSearchChange={setSearchValue}
              />
            }
          />
          <Route
            path="/projects-v6"
            element={
              <ProjectListV6
                search={searchValue}
                onSearchChange={setSearchValue}
              />
            }
          />
            <Route path="/projects/:id/tasks/:nodeId" element={<TaskWorkspace />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route
              path="/todo"
              element={<MyTodo />}
            />
            <Route
              path="/auto-report"
              element={<AutoReport />}
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
    </ProjectsProvider>
  );
}
