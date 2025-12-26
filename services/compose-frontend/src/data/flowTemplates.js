const TEMPLATE_LAYOUT = {
  padX: 80,
  padY: 60,
  laneWidth: 260,
  rowHeight: 240,
};

const positionFor = (row, col = 1) => ({
  x: TEMPLATE_LAYOUT.padX + col * TEMPLATE_LAYOUT.laneWidth,
  y: TEMPLATE_LAYOUT.padY + row * TEMPLATE_LAYOUT.rowHeight,
});

export const createEmptyWorkspace = () => ({
  fields: [],
  templates: [],
});

export const normalizeWorkspace = (workspace) => ({
  fields: Array.isArray(workspace?.fields) ? workspace.fields : [],
  templates: Array.isArray(workspace?.templates) ? workspace.templates : [],
});

const stripKeys = (value, keys) => {
  if (!value || typeof value !== "object") {
    return value;
  }
  const next = { ...value };
  keys.forEach((key) => {
    if (key in next) {
      delete next[key];
    }
  });
  return next;
};

const sanitizeFieldSchema = (field) =>
  stripKeys(field, ["value", "values", "currentValue"]);

const sanitizeTemplateSchema = (template) =>
  stripKeys(template, ["content", "fields", "documentId", "docId", "file"]);

export const sanitizeWorkspace = (workspace) => {
  const normalized = normalizeWorkspace(workspace);
  return {
    fields: normalized.fields.map(sanitizeFieldSchema),
    templates: normalized.templates.map(sanitizeTemplateSchema),
  };
};

export const DEFAULT_FLOW_TEMPLATE = {
  id: "simple-default",
  name: "简单模板",
  description: "线性流程，适合快速建立项目主线。",
  flow: {
    nodes: [
      {
        id: "init",
        type: "projectDetailCard",
        position: positionFor(0),
        data: {
          title: "立项准备",
          kind: "任务",
          owner: "项目经理",
          status: "待开始",
          output: "立项材料",
          note: "梳理范围与目标",
          workspace: {
            fields: [
              { id: "scope", label: "项目范围", type: "text", required: true },
              { id: "budget", label: "预算金额", type: "number" },
            ],
            templates: [{ id: "tpl-init", name: "立项请示模板", fileId: "tmpl-init" }],
          },
        },
      },
      {
        id: "review",
        type: "projectDetailCard",
        position: positionFor(1),
        data: {
          title: "立项审批",
          kind: "审批",
          owner: "项目负责人",
          status: "待开始",
          output: "立项批复",
          note: "汇报关键事项",
          workspace: {
            fields: [
              {
                id: "approval-level",
                label: "审批层级",
                type: "select",
                options: ["部门", "公司"],
              },
            ],
            templates: [{ id: "tpl-review", name: "审批单模板", fileId: "tmpl-review" }],
          },
        },
      },
      {
        id: "plan",
        type: "projectDetailCard",
        position: positionFor(2),
        data: {
          title: "方案与计划",
          kind: "任务",
          owner: "项目办公室",
          status: "待开始",
          output: "实施计划",
          note: "明确里程碑",
          workspace: {
            fields: [
              { id: "plan-version", label: "计划版本", type: "text" },
              { id: "milestones", label: "关键里程碑", type: "text" },
            ],
            templates: [],
          },
        },
      },
      {
        id: "execute",
        type: "projectDetailCard",
        position: positionFor(3),
        data: {
          title: "执行与跟踪",
          kind: "任务",
          owner: "实施负责人",
          status: "待开始",
          output: "阶段交付包",
          note: "同步进度与风险",
          workspace: {
            fields: [{ id: "progress", label: "阶段进度", type: "number" }],
            templates: [],
          },
        },
      },
      {
        id: "accept",
        type: "projectDetailCard",
        position: positionFor(4),
        data: {
          title: "验收审批",
          kind: "审批",
          owner: "验收负责人",
          status: "待开始",
          output: "验收结论",
          note: "确认交付结果",
          workspace: {
            fields: [{ id: "criteria", label: "验收标准", type: "text" }],
            templates: [],
          },
        },
      },
      {
        id: "archive",
        type: "projectDetailCard",
        position: positionFor(5),
        data: {
          title: "交付归档",
          kind: "交付物",
          owner: "档案管理员",
          status: "待开始",
          output: "归档资料",
          note: "整理并交付归档",
          workspace: {
            fields: [{ id: "archive-list", label: "归档清单", type: "text" }],
            templates: [
              { id: "tpl-archive", name: "归档清单模板", fileId: "tmpl-archive" },
            ],
          },
        },
      },
    ],
    edges: [
      { id: "edge-init-review", source: "init", target: "review" },
      { id: "edge-review-plan", source: "review", target: "plan" },
      { id: "edge-plan-execute", source: "plan", target: "execute" },
      { id: "edge-execute-accept", source: "execute", target: "accept" },
      { id: "edge-accept-archive", source: "accept", target: "archive" },
    ],
  },
};

export const cloneFlow = (flow) => {
  if (!flow) {
    return { nodes: [], edges: [] };
  }
  if (typeof flow === "string") {
    try {
      return JSON.parse(flow);
    } catch (error) {
      return { nodes: [], edges: [] };
    }
  }
  return JSON.parse(JSON.stringify(flow));
};

export const sanitizeFlowForCreate = (flow) => {
  const safe = flow && typeof flow === "object" ? flow : {};
  const nodes = Array.isArray(safe.nodes) ? safe.nodes : [];
  const edges = Array.isArray(safe.edges) ? safe.edges : [];

  return {
    nodes: nodes.map((node, index) => {
      const data = node?.data || {};
      return {
        ...node,
        id: node?.id || `node-${index + 1}`,
        data: {
          ...data,
          workspace: sanitizeWorkspace(data.workspace),
        },
      };
    }),
    edges: edges
      .map((edge, index) => ({
        id: edge?.id || `edge-${edge?.source}-${edge?.target}-${index}`,
        source: edge?.source,
        target: edge?.target,
        sourceHandle: edge?.sourceHandle,
        targetHandle: edge?.targetHandle,
      }))
      .filter((edge) => edge.source && edge.target),
  };
};
