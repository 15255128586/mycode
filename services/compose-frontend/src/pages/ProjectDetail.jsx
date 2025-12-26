import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dagre from "dagre";
import ReactFlow, {
  addEdge,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlowProvider,
  useReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { useNavigate, useParams } from "react-router-dom";
import "reactflow/dist/style.css";
import Placeholder from "./Placeholder.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ProjectFormModal from "../components/ProjectFormModal.jsx";
import { useProjects } from "../state/projects.jsx";

const statusToneMap = {
  已完成: "leaf",
  进行中: "sun",
  待开始: "muted",
  阻塞: "alert",
};

const kindToneMap = {
  任务: "accent",
  交付物: "calm",
  审批: "sun",
  结果: "leaf",
};

const miniMapToneColors = {
  accent: "var(--accent)",
  calm: "var(--calm)",
  sun: "var(--sun)",
  leaf: "var(--leaf)",
  muted: "var(--muted)",
};

const getMiniMapNodeColor = (node) => {
  const tone = kindToneMap[node?.data?.kind] || "muted";
  return miniMapToneColors[tone] || miniMapToneColors.muted;
};

const layout = {
  padX: 80,
  padY: 60,
  laneWidth: 260,
  rowHeight: 240,
};

const NODE_WIDTH = 230;
const NODE_HEIGHT = 160;
const GRID_X = 260;
const GRID_Y = 260;

const snapPosition = (position, originX, originY) => ({
  x: Math.max(
    originX,
    Math.round((position.x - originX) / GRID_X) * GRID_X + originX
  ),
  y: Math.max(
    originY,
    Math.round((position.y - originY) / GRID_Y) * GRID_Y + originY
  ),
});

const getLayoutedNodes = (nodes, edges, originX, originY) => {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "TB",
    nodesep: 40,
    ranksep: 140,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layouted = nodes.map((node) => {
    const layoutNode = graph.node(node.id);
    if (!layoutNode) {
      return node;
    }

    const nextPosition = {
      x: layoutNode.x - NODE_WIDTH / 2,
      y: layoutNode.y - NODE_HEIGHT / 2,
    };

    return {
      ...node,
      position: nextPosition,
    };
  });

  const minX = layouted.reduce(
    (current, node) => Math.min(current, node.position.x),
    Infinity
  );
  const minY = layouted.reduce(
    (current, node) => Math.min(current, node.position.y),
    Infinity
  );
  const offsetX = Math.max(originX - minX, 0);
  const offsetY = Math.max(originY - minY, 0);

  if (!offsetX && !offsetY) {
    return layouted;
  }

  return layouted.map((node) => ({
    ...node,
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
  }));
};

const centerNodesHorizontally = (nodes, containerWidth) => {
  if (!containerWidth) {
    return nodes;
  }

  const minX = nodes.reduce(
    (current, node) => Math.min(current, node.position.x),
    Infinity
  );
  const maxX = nodes.reduce(
    (current, node) => Math.max(current, node.position.x + NODE_WIDTH),
    -Infinity
  );
  const contentWidth = maxX - minX;

  if (contentWidth >= containerWidth) {
    return nodes;
  }

  const targetLeft = Math.max(layout.padX, (containerWidth - contentWidth) / 2);
  const deltaX = Math.round((targetLeft - minX) / GRID_X) * GRID_X;

  if (!deltaX) {
    return nodes;
  }

  return nodes.map((node) => ({
    ...node,
    position: {
      ...node.position,
      x: node.position.x + deltaX,
    },
  }));
};

const defaultOutputByKind = {
  任务: "待推进",
  审批: "待批复",
  交付物: "待归档",
};

const createEdge = (params) => ({
  ...params,
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#c7cbd3",
  },
  style: { stroke: "#c7cbd3", strokeWidth: 2 },
});

const seedNodes = [
  {
    id: "draft",
    title: "起草请示文件",
    kind: "任务",
    owner: "项目办公室",
    status: "进行中",
    output: "请示文件",
    note: "等待附件补充",
    row: 0,
    col: 1,
  },
  {
    id: "report",
    title: "上会汇报",
    kind: "审批",
    owner: "项目负责人",
    status: "待开始",
    output: "会议决议",
    note: "需准备演示材料",
    row: 1,
    col: 1,
  },
  {
    id: "minutes",
    title: "会议纪要（盖章版）",
    kind: "交付物",
    owner: "办公室",
    status: "待开始",
    output: "纪要文件",
    note: "盖章后归档",
    row: 2,
    col: 1,
  },
  {
    id: "contract",
    title: "合同初稿",
    kind: "任务",
    owner: "法务",
    status: "待开始",
    output: "合同文本",
    note: "版本 v0.1",
    row: 3,
    col: 0,
  },
  {
    id: "budget",
    title: "预算校核",
    kind: "任务",
    owner: "财务",
    status: "待开始",
    output: "预算确认",
    note: "参考批复金额",
    row: 3,
    col: 1,
  },
  {
    id: "procure",
    title: "招采方案",
    kind: "任务",
    owner: "采购",
    status: "待开始",
    output: "招采方案",
    note: "需比价清单",
    row: 3,
    col: 2,
  },
  {
    id: "merge",
    title: "合同会签",
    kind: "审批",
    owner: "项目负责人",
    status: "待开始",
    output: "会签记录",
    note: "多部门确认",
    row: 4,
    col: 1,
  },
  {
    id: "archive",
    title: "归档入库",
    kind: "交付物",
    owner: "档案室",
    status: "待开始",
    output: "归档包",
    note: "含盖章件",
    row: 5,
    col: 1,
  },
  {
    id: "payment",
    title: "付款申请",
    kind: "任务",
    owner: "财务",
    status: "待开始",
    output: "付款申请单",
    note: "对齐付款节点",
    row: 6,
    col: 1,
  },
  {
    id: "done",
    title: "付款完成",
    kind: "结果",
    owner: "财务",
    status: "待开始",
    output: "付款凭证",
    note: "归档存证",
    row: 7,
    col: 1,
  },
];

const baseNodes = seedNodes.map((seed) => ({
  id: seed.id,
  type: "projectDetailCard",
  position: {
    x: layout.padX + seed.col * layout.laneWidth,
    y: layout.padY + seed.row * layout.rowHeight,
  },
  data: {
    title: seed.title,
    kind: seed.kind,
    owner: seed.owner,
    status: seed.status,
    output: seed.output,
    note: seed.note,
  },
}));

const baseEdges = [
  { from: "draft", to: "report" },
  { from: "report", to: "minutes" },
  { from: "minutes", to: "contract" },
  { from: "minutes", to: "budget" },
  { from: "minutes", to: "procure" },
  { from: "contract", to: "merge" },
  { from: "budget", to: "merge" },
  { from: "procure", to: "merge" },
  { from: "merge", to: "archive" },
  { from: "archive", to: "payment" },
  { from: "payment", to: "done" },
].map((edge, index) => ({
  id: `edge-${edge.from}-${edge.to}-${index}`,
  source: edge.from,
  target: edge.to,
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#c7cbd3",
  },
  style: { stroke: "#c7cbd3", strokeWidth: 2 },
}));

function ProjectDetailNode({ data, selected }) {
  const statusTone = statusToneMap[data.status] || "muted";
  const kindTone = kindToneMap[data.kind] || "muted";

  return (
    <div className={`project-detail-node ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Top} className="project-detail-handle" />
      <div className="project-detail-card">
        <div className="project-detail-header">
          <span className={`project-detail-pill project-detail-pill-${kindTone}`}>
            {data.kind}
          </span>
          <span className={`project-detail-pill project-detail-status-${statusTone}`}>
            {data.status}
          </span>
        </div>
        <div className="project-detail-title">{data.title}</div>
        <div className="project-detail-meta">负责人 {data.owner}</div>
        <div className="project-detail-output">产出 {data.output}</div>
        {data.note ? <div className="project-detail-note">{data.note}</div> : null}
      </div>
      <Handle type="source" position={Position.Bottom} className="project-detail-handle" />
    </div>
  );
}

const nodeTypes = {
  projectDetailCard: ProjectDetailNode,
};

function ProjectDetailInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    updateProject,
    archiveProject,
    restoreProject,
    deleteProject,
    isLoading,
    error,
    reloadProjects,
  } = useProjects();
  const project = useMemo(
    () => projects.find((item) => item.code === id),
    [id, projects]
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);
  const initialLayoutDone = useRef(false);
  const canvasRef = useRef(null);
  const dialogInputRef = useRef(null);
  const connectionSourceRef = useRef(null);
  const connectionMadeRef = useRef(false);
  const nodeIdRef = useRef(0);
  const { screenToFlowPosition } = useReactFlow();
  const [createDialog, setCreateDialog] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftKind, setDraftKind] = useState("任务");

  const onConnect = useCallback(
    (params) => {
      connectionMadeRef.current = true;
      setEdges((eds) => addEdge(createEdge(params), eds));
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_event, params) => {
    connectionSourceRef.current = params;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (connectionMadeRef.current) {
        connectionMadeRef.current = false;
        connectionSourceRef.current = null;
        return;
      }

      const pane = event.target?.closest?.(".react-flow__pane");
      if (!pane || !connectionSourceRef.current) {
        connectionSourceRef.current = null;
        return;
      }

      const point =
        "changedTouches" in event && event.changedTouches?.[0]
          ? event.changedTouches[0]
          : event;
      const flowPosition = screenToFlowPosition({
        x: point.clientX,
        y: point.clientY,
      });

      setDraftTitle("");
      setDraftKind("任务");
      setCreateDialog({
        position: flowPosition,
        source: connectionSourceRef.current,
      });
      connectionSourceRef.current = null;
    },
    [screenToFlowPosition]
  );

  const applyAutoLayout = useCallback(() => {
    setNodes((nds) => {
      const layouted = getLayoutedNodes(nds, edges, layout.padX, layout.padY);
      const containerWidth = canvasRef.current?.clientWidth ?? 0;
      return centerNodesHorizontally(layouted, containerWidth);
    });
  }, [edges, setNodes]);

  const handlePaneClick = useCallback(
    (event) => {
      if (event.detail === 2) {
        applyAutoLayout();
      }
    },
    [applyAutoLayout]
  );

  const handleNodeClick = useCallback(
    (_event, node) => {
      if (!node || node.data?.kind !== "任务") {
        return;
      }
      if (!id) {
        return;
      }
      navigate(`/projects/${id}/tasks/${node.id}`, {
        state: {
          nodeTitle: node.data?.title,
          kind: node.data?.kind,
        },
      });
    },
    [id, navigate]
  );

  const applyCenteringOnly = useCallback(() => {
    const containerWidth = canvasRef.current?.clientWidth ?? 0;
    if (!containerWidth) {
      return;
    }
    setNodes((nds) => centerNodesHorizontally(nds, containerWidth));
  }, [setNodes]);

  const handleNodeDragStop = useCallback(
    (_event, node) => {
      const snapped = snapPosition(node.position, layout.padX, layout.padY);
      setNodes((nds) =>
        nds.map((item) =>
          item.id === node.id ? { ...item, position: snapped } : item
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    if (initialLayoutDone.current) {
      return;
    }
    initialLayoutDone.current = true;
    applyAutoLayout();
  }, [applyAutoLayout]);

  useEffect(() => {
    const handleResize = () => {
      applyCenteringOnly();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [applyCenteringOnly]);

  const handleCreateNode = useCallback(() => {
    if (!createDialog || !draftTitle.trim()) {
      return;
    }

    nodeIdRef.current += 1;
    const nextId = `node-${Date.now()}-${nodeIdRef.current}`;
    const snappedPosition = snapPosition(
      createDialog.position,
      layout.padX,
      layout.padY
    );
    const output = defaultOutputByKind[draftKind] || "待定义";

    const newNode = {
      id: nextId,
      type: "projectDetailCard",
      position: snappedPosition,
      data: {
        title: draftTitle.trim(),
        kind: draftKind,
        owner: "未分配",
        status: "待开始",
        output,
        note: "",
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) =>
      addEdge(
        createEdge({
          source: createDialog.source.nodeId,
          sourceHandle: createDialog.source.handleId,
          target: nextId,
        }),
        eds
      )
    );
    setCreateDialog(null);
  }, [createDialog, draftKind, draftTitle, setEdges, setNodes]);

  useEffect(() => {
    if (!createDialog) {
      return;
    }
    const focusTimer = window.setTimeout(() => {
      dialogInputRef.current?.focus();
    }, 0);
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setCreateDialog(null);
      }
      if (event.key === "Enter" && draftTitle.trim()) {
        event.preventDefault();
        handleCreateNode();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [createDialog, draftTitle, handleCreateNode]);

  if (isLoading) {
    return (
      <div className="project-detail-only">
        <div className="panel" style={{ padding: "24px" }}>
          正在加载项目...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-only">
        <div className="panel" style={{ padding: "24px" }}>
          {error}
          <button className="ghost-button" onClick={reloadProjects}>
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <Placeholder
        title="项目不存在"
        subtitle="返回项目列表"
        note="当前项目不存在，请从列表重新进入。"
      />
    );
  }

  return (
    <div className="project-detail-only">
      <header className="project-detail-headerbar panel">
        <div className="project-detail-header-main">
          <div className="project-detail-header-eyebrow">{project.code}</div>
          <div className="project-detail-header-title">{project.name}</div>
          <div className="project-detail-header-meta">
            <span className="project-detail-meta-item">负责人 {project.owner}</span>
            <span className="project-detail-meta-item">截止 {project.due}</span>
            <span className="project-detail-meta-item">状态 {project.status}</span>
            {project.archived ? (
              <span className="status-pill status-archived">已归档</span>
            ) : null}
          </div>
        </div>
        <div className="project-detail-header-actions">
          <button
            className="secondary-button"
            onClick={() => setEditDialogOpen(true)}
          >
            编辑信息
          </button>
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
            className="danger-button"
            onClick={() => setPendingDelete(true)}
          >
            删除
          </button>
        </div>
      </header>
      <div
        className="project-detail-canvas"
        ref={canvasRef}
      >
        <div className="project-detail-hints">
          <div className="project-detail-hints-title">使用提示</div>
          <ul className="project-detail-hints-list">
            <li>拖动节点手柄到空白处，可创建新节点</li>
            <li>按住 Ctrl/⌘ 滚轮缩放画布</li>
            <li>滚轮上下平移，拖动画布可自由移动</li>
            <li>双击空白区域自动整理布局</li>
          </ul>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeDragStop={handleNodeDragStop}
          onPaneClick={handlePaneClick}
          onNodeClick={handleNodeClick}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          zoomActivationKeyCode={["Control", "Meta"]}
          preventScrolling
          panOnDrag
          panOnScroll
          panOnScrollMode="vertical"
          defaultEdgeOptions={{ type: "smoothstep" }}
          style={{ width: "100%", height: "100%" }}
        >
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeStrokeColor="rgba(29, 27, 23, 0.4)"
            nodeColor={getMiniMapNodeColor}
            maskColor="rgba(29, 27, 23, 0.18)"
            maskStrokeColor="rgba(29, 27, 23, 0.55)"
            maskStrokeWidth={2}
            nodeBorderRadius={6}
          />
        </ReactFlow>
      </div>
      {createDialog ? (
        <div
          className="project-detail-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setCreateDialog(null)}
        >
          <div
            className="project-detail-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="project-detail-modal-title">新建节点</div>
            <div className="project-detail-modal-field">
              <div className="project-detail-modal-label">类型</div>
              <div className="project-detail-modal-types">
                {["任务", "审批", "交付物"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`project-detail-type ${
                      draftKind === item ? "active" : ""
                    }`}
                    onClick={() => setDraftKind(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="project-detail-modal-field">
              <div className="project-detail-modal-label">标题</div>
              <input
                ref={dialogInputRef}
                className="project-detail-modal-input"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="请输入节点名称"
              />
            </div>
            <div className="project-detail-modal-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setCreateDialog(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleCreateNode}
                disabled={!draftTitle.trim()}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {editDialogOpen ? (
        <ProjectFormModal
          title="编辑项目"
          submitLabel="保存"
          codeReadOnly
          initialValues={{
            name: project.name,
            code: project.code,
            owner: project.owner,
            status: project.status,
            due: project.due,
            department: project.department || "",
            desc: project.desc || "",
            health: project.health || "稳定",
            progress: project.progress ?? 0,
          }}
          onSubmit={(payload) => {
            updateProject(project.code, payload);
            setEditDialogOpen(false);
          }}
          onClose={() => setEditDialogOpen(false)}
        />
      ) : null}
      {pendingDelete ? (
        <ConfirmDialog
          title="确认删除项目？"
          message={`删除后将无法恢复：${project.name}`}
          confirmLabel="删除"
          onConfirm={() => {
            deleteProject(project.code);
            navigate("/");
          }}
          onCancel={() => setPendingDelete(false)}
        />
      ) : null}
    </div>
  );
}

export default function ProjectDetail() {
  return (
    <ReactFlowProvider>
      <ProjectDetailInner />
    </ReactFlowProvider>
  );
}
