import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dagre from "dagre";
import ReactFlow, {
  addEdge,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  useReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { useParams } from "react-router-dom";
import "reactflow/dist/style.css";
import Placeholder from "./Placeholder.jsx";
import { getProjectByCode } from "../data/projects.js";

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

  return nodes.map((node) => {
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
      position: snapPosition(nextPosition, originX, originY),
    };
  });
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
  type: "appleCard",
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

function AppleNode({ data, selected }) {
  const statusTone = statusToneMap[data.status] || "muted";
  const kindTone = kindToneMap[data.kind] || "muted";

  return (
    <div className={`flow-apple-node ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Top} className="flow-apple-handle" />
      <div className="flow-apple-card">
        <div className="flow-apple-header">
          <span className={`flow-apple-pill flow-apple-pill-${kindTone}`}>
            {data.kind}
          </span>
          <span className={`flow-apple-pill flow-apple-status-${statusTone}`}>
            {data.status}
          </span>
        </div>
        <div className="flow-apple-title">{data.title}</div>
        <div className="flow-apple-meta">负责人 {data.owner}</div>
        <div className="flow-apple-output">产出 {data.output}</div>
        {data.note ? <div className="flow-apple-note">{data.note}</div> : null}
      </div>
      <Handle type="source" position={Position.Bottom} className="flow-apple-handle" />
    </div>
  );
}

const nodeTypes = {
  appleCard: AppleNode,
};

export default function ProjectFlowApple() {
  const { id } = useParams();
  const project = getProjectByCode(id);
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
      type: "appleCard",
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

  const canvasHeight = useMemo(() => {
    const maxY = nodes.reduce(
      (current, node) => Math.max(current, node.position.y + NODE_HEIGHT),
      0
    );
    return Math.max(1400, maxY + 240);
  }, [nodes]);

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
    <div className="flow-apple-only">
      <div
        className="flow-apple-canvas"
        style={{ height: canvasHeight }}
        ref={canvasRef}
      >
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
          onPaneDoubleClick={applyAutoLayout}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          panOnDrag={false}
          panOnScroll={false}
          defaultEdgeOptions={{ type: "smoothstep" }}
          style={{ width: "100%", height: "100%" }}
        >
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeStrokeColor="#c7cbd3"
            nodeColor="#ffffff"
            maskColor="rgba(255, 255, 255, 0.7)"
          />
        </ReactFlow>
      </div>
      {createDialog ? (
        <div
          className="flow-apple-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setCreateDialog(null)}
        >
          <div
            className="flow-apple-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flow-apple-modal-title">新建节点</div>
            <div className="flow-apple-modal-field">
              <div className="flow-apple-modal-label">类型</div>
              <div className="flow-apple-modal-types">
                {["任务", "审批", "交付物"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`flow-apple-type ${
                      draftKind === item ? "active" : ""
                    }`}
                    onClick={() => setDraftKind(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flow-apple-modal-field">
              <div className="flow-apple-modal-label">标题</div>
              <input
                ref={dialogInputRef}
                className="flow-apple-modal-input"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="请输入节点名称"
              />
            </div>
            <div className="flow-apple-modal-actions">
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
    </div>
  );
}
