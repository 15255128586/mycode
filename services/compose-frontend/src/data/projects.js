const stageTemplate = [
  {
    key: "立项",
    gate: "立项评审",
    entryCriteria: ["业务目标明确", "关键干系人确认", "初版需求收集"],
    exitCriteria: ["范围确认", "资源确认", "风险识别"],
  },
  {
    key: "规划",
    gate: "计划评审",
    entryCriteria: ["需求拆解完成", "里程碑草案", "预算估算"],
    exitCriteria: ["计划基线", "交付物清单", "里程碑确认"],
  },
  {
    key: "建设",
    gate: "方案评审",
    entryCriteria: ["设计方案确认", "开发排期", "依赖澄清"],
    exitCriteria: ["核心功能完成", "联调通过", "测试计划"],
  },
  {
    key: "测试",
    gate: "上线评审",
    entryCriteria: ["回归测试通过", "缺陷收敛", "发布材料准备"],
    exitCriteria: ["上线清单", "回滚方案", "监控配置"],
  },
  {
    key: "发布",
    gate: "复盘验收",
    entryCriteria: ["上线完成", "监控稳定", "运营交接"],
    exitCriteria: ["复盘报告", "KPI 跟踪", "遗留问题清单"],
  },
];

function buildStages(activeIndex, overrides = {}) {
  return stageTemplate.map((stage, index) => {
    let status = "待开始";
    if (index < activeIndex) {
      status = "已通过";
    } else if (index === activeIndex) {
      status = "进行中";
    }

    const override = overrides[stage.key] || {};

    return {
      title: stage.key,
      gate: stage.gate,
      entryCriteria: override.entryCriteria || stage.entryCriteria,
      exitCriteria: override.exitCriteria || stage.exitCriteria,
      status: override.status || status,
      date: override.date || "",
      approvals: override.approvals || [],
    };
  });
}

export const projects = [
  {
    name: "银河计划 · 客户旅程重构",
    code: "PRJ-0921",
    status: "进行中",
    statusTone: "ontrack",
    owner: "Mira",
    due: "9 月 28 日",
    budget: "¥128 万",
    health: "稳定",
    healthTone: "leaf",
    progress: 72,
    phase: "体验验证",
    department: "增长与体验",
    desc: "覆盖 5 大触点的流程再设计，当前在体验验证阶段。",
    summary: "客户旅程重构进入验证收口，重点关注跨部门协作与渠道一致性。",
    stages: buildStages(3, {
      立项: {
        date: "8 月 2 日",
        approvals: [
          { title: "立项评审", owner: "PMO", date: "8 月 2 日", status: "已通过" },
          { title: "资源确认", owner: "管理层", date: "8 月 3 日", status: "已通过" },
        ],
      },
      规划: {
        date: "8 月 16 日",
        approvals: [
          { title: "计划评审", owner: "PMO", date: "8 月 16 日", status: "已通过" },
        ],
      },
      建设: {
        date: "9 月 1 日",
        approvals: [
          { title: "方案评审", owner: "产品组", date: "9 月 1 日", status: "已通过" },
        ],
      },
      测试: {
        date: "9 月 12 日",
        approvals: [
          { title: "上线评审", owner: "质量组", date: "待定", status: "待评审" },
        ],
      },
    }),
    deliverables: [
      { title: "旅程地图定稿", owner: "AL", due: "9 月 5 日", status: "已完成" },
      { title: "触点体验测试报告", owner: "SK", due: "9 月 14 日", status: "进行中" },
      { title: "上线培训资料包", owner: "VC", due: "9 月 23 日", status: "待开始" },
    ],
    milestones: [
      { title: "旅程地图对齐", date: "8 月 30 日", status: "已完成" },
      { title: "触点体验验证", date: "9 月 12 日", status: "进行中" },
      { title: "上线准备", date: "9 月 26 日", status: "待开始" },
    ],
    tasks: [
      { title: "门店触点流程复盘", owner: "AL", status: "进行中" },
      { title: "App 首屏体验测试", owner: "SK", status: "进行中" },
      { title: "运营脚本同步", owner: "VC", status: "待开始" },
    ],
    risks: [
      { title: "渠道培训时间不足", level: "中" },
      { title: "跨部门反馈周期偏长", level: "中" },
    ],
    team: [
      { name: "Mira", role: "项目负责人" },
      { name: "Avery", role: "研究" },
      { name: "Satoshi", role: "体验设计" },
    ],
  },
  {
    name: "Aurora · 数据资产升级",
    code: "PRJ-0874",
    status: "需关注",
    statusTone: "risk",
    owner: "Avery",
    due: "10 月 6 日",
    budget: "¥96 万",
    health: "偏紧",
    healthTone: "sun",
    progress: 54,
    phase: "规范落地",
    department: "数据平台",
    desc: "指标口径待确认，数据治理工作量上升。",
    summary: "数据治理规范已发布，重点推进指标口径统一与数据回流。",
    stages: buildStages(2, {
      立项: {
        date: "7 月 28 日",
        approvals: [
          { title: "立项评审", owner: "PMO", date: "7 月 28 日", status: "已通过" },
        ],
      },
      规划: {
        date: "8 月 15 日",
        approvals: [
          { title: "计划评审", owner: "数据平台", date: "8 月 15 日", status: "已通过" },
        ],
      },
      建设: {
        date: "9 月 6 日",
        approvals: [
          { title: "方案评审", owner: "架构组", date: "9 月 6 日", status: "待评审" },
        ],
      },
    }),
    deliverables: [
      { title: "指标口径说明书", owner: "AL", due: "9 月 8 日", status: "进行中" },
      { title: "数据资产清单", owner: "JR", due: "9 月 20 日", status: "待开始" },
      { title: "治理工具上线报告", owner: "TP", due: "10 月 4 日", status: "待审核" },
    ],
    milestones: [
      { title: "指标口径评审", date: "9 月 6 日", status: "进行中" },
      { title: "数据资产清单", date: "9 月 20 日", status: "待开始" },
      { title: "治理工具上线", date: "10 月 4 日", status: "待开始" },
    ],
    tasks: [
      { title: "指标口径差异梳理", owner: "AL", status: "进行中" },
      { title: "数据字典更新", owner: "JR", status: "待开始" },
      { title: "采集链路巡检", owner: "TP", status: "进行中" },
    ],
    risks: [
      { title: "口径冲突未统一", level: "高" },
      { title: "治理资源投入不足", level: "中" },
    ],
    team: [
      { name: "Avery", role: "项目负责人" },
      { name: "JR", role: "数据分析" },
      { name: "TP", role: "平台开发" },
    ],
  },
  {
    name: "Atlas · 交付看板重构",
    code: "PRJ-0903",
    status: "进行中",
    statusTone: "ontrack",
    owner: "Satoshi",
    due: "9 月 10 日",
    budget: "¥64 万",
    health: "健康",
    healthTone: "leaf",
    progress: 83,
    phase: "联调收口",
    department: "设计平台",
    desc: "设计系统已更新，开发进入收口联调。",
    summary: "交付看板重构已进入联调阶段，重点确保权限模型与多项目视图。",
    stages: buildStages(3, {
      立项: {
        date: "8 月 5 日",
        approvals: [
          { title: "立项评审", owner: "PMO", date: "8 月 5 日", status: "已通过" },
        ],
      },
      规划: {
        date: "8 月 20 日",
        approvals: [
          { title: "计划评审", owner: "设计平台", date: "8 月 20 日", status: "已通过" },
        ],
      },
      建设: {
        date: "8 月 30 日",
        approvals: [
          { title: "方案评审", owner: "技术委员会", date: "8 月 30 日", status: "已通过" },
        ],
      },
      测试: {
        date: "9 月 2 日",
        approvals: [
          { title: "上线评审", owner: "质量组", date: "待定", status: "待评审" },
        ],
      },
    }),
    deliverables: [
      { title: "交付看板新界面", owner: "SK", due: "9 月 1 日", status: "已完成" },
      { title: "权限模型说明", owner: "TP", due: "9 月 4 日", status: "进行中" },
      { title: "上线验收报告", owner: "VC", due: "9 月 9 日", status: "待开始" },
    ],
    milestones: [
      { title: "交互原型确认", date: "8 月 18 日", status: "已完成" },
      { title: "联调演示", date: "9 月 2 日", status: "进行中" },
      { title: "上线验收", date: "9 月 9 日", status: "待开始" },
    ],
    tasks: [
      { title: "权限边界测试", owner: "SK", status: "进行中" },
      { title: "多看板视图切换", owner: "TP", status: "进行中" },
      { title: "交付日志迁移", owner: "VC", status: "待开始" },
    ],
    risks: [
      { title: "历史数据迁移延迟", level: "中" },
      { title: "权限模型测试不足", level: "低" },
    ],
    team: [
      { name: "Satoshi", role: "项目负责人" },
      { name: "TP", role: "后端" },
      { name: "VC", role: "运营" },
    ],
  },
  {
    name: "Nova · 合作伙伴入驻",
    code: "PRJ-0842",
    status: "已暂停",
    statusTone: "hold",
    owner: "Noah",
    due: "待定",
    budget: "¥52 万",
    health: "暂停",
    healthTone: "muted",
    progress: 38,
    phase: "等待签约",
    department: "增长",
    desc: "等待法务流程，外部签约预计 2 周后恢复。",
    summary: "合作伙伴签约暂停，需同步法务与商务计划。",
    stages: buildStages(1, {
      立项: {
        date: "7 月 10 日",
        approvals: [
          { title: "立项评审", owner: "PMO", date: "7 月 10 日", status: "已通过" },
        ],
      },
      规划: {
        status: "已暂停",
        date: "7 月 26 日",
        approvals: [
          { title: "计划评审", owner: "商务组", date: "待定", status: "驳回" },
        ],
      },
    }),
    deliverables: [
      { title: "合作条款清单", owner: "PA", due: "8 月 12 日", status: "已完成" },
      { title: "签约模板定稿", owner: "PA", due: "待定", status: "待开始" },
      { title: "伙伴培训包", owner: "NM", due: "待定", status: "待开始" },
    ],
    milestones: [
      { title: "合作条款评审", date: "8 月 12 日", status: "已完成" },
      { title: "合同签署", date: "待定", status: "待开始" },
      { title: "伙伴培训", date: "待定", status: "待开始" },
    ],
    tasks: [
      { title: "合同条款调整", owner: "PA", status: "进行中" },
      { title: "伙伴资料归档", owner: "NM", status: "待开始" },
      { title: "上线清单准备", owner: "VC", status: "待开始" },
    ],
    risks: [
      { title: "签约窗口不确定", level: "高" },
      { title: "伙伴预期变动", level: "中" },
    ],
    team: [
      { name: "Noah", role: "项目负责人" },
      { name: "PA", role: "商务" },
      { name: "NM", role: "增长" },
    ],
  },
  {
    name: "Pulse · 品牌升级",
    code: "PRJ-0912",
    status: "进行中",
    statusTone: "ontrack",
    owner: "Mira",
    due: "9 月 22 日",
    budget: "¥74 万",
    health: "稳定",
    healthTone: "leaf",
    progress: 66,
    phase: "传播准备",
    department: "品牌与市场",
    desc: "品牌资产已完成 80%，传播计划待评审。",
    summary: "品牌升级核心资产已完成，传播计划与渠道素材同步推进。",
    stages: buildStages(2, {
      立项: {
        date: "8 月 1 日",
        approvals: [
          { title: "立项评审", owner: "PMO", date: "8 月 1 日", status: "已通过" },
        ],
      },
      规划: {
        date: "8 月 18 日",
        approvals: [
          { title: "计划评审", owner: "品牌组", date: "8 月 18 日", status: "已通过" },
        ],
      },
      建设: {
        date: "9 月 4 日",
        approvals: [
          { title: "方案评审", owner: "市场组", date: "待定", status: "待评审" },
        ],
      },
    }),
    deliverables: [
      { title: "品牌主视觉", owner: "SK", due: "9 月 6 日", status: "进行中" },
      { title: "传播计划", owner: "NM", due: "9 月 14 日", status: "待审核" },
      { title: "发布会手册", owner: "AL", due: "9 月 20 日", status: "待开始" },
    ],
    milestones: [
      { title: "品牌资产定稿", date: "9 月 4 日", status: "进行中" },
      { title: "传播计划评审", date: "9 月 14 日", status: "待开始" },
      { title: "发布会准备", date: "9 月 20 日", status: "待开始" },
    ],
    tasks: [
      { title: "主视觉定稿", owner: "SK", status: "进行中" },
      { title: "媒介合作沟通", owner: "NM", status: "待开始" },
      { title: "发布素材检查", owner: "AL", status: "待开始" },
    ],
    risks: [
      { title: "传播预算调整", level: "中" },
      { title: "素材产能不足", level: "低" },
    ],
    team: [
      { name: "Mira", role: "项目负责人" },
      { name: "SK", role: "设计" },
      { name: "NM", role: "增长" },
    ],
  },
  {
    name: "Helios · 自动化运营",
    code: "PRJ-0797",
    status: "需关注",
    statusTone: "risk",
    owner: "Avery",
    due: "9 月 30 日",
    budget: "¥110 万",
    health: "延迟",
    healthTone: "alert",
    progress: 49,
    phase: "流程搭建",
    department: "运营效率",
    desc: "依赖服务稳定性不足，需要平台支持。",
    summary: "自动化运营试运行中，需优先保障基础服务稳定性。",
    stages: buildStages(2, {
      立项: {
        date: "8 月 8 日",
        approvals: [
          { title: "立项评审", owner: "PMO", date: "8 月 8 日", status: "已通过" },
        ],
      },
      规划: {
        date: "8 月 26 日",
        approvals: [
          { title: "计划评审", owner: "运营组", date: "8 月 26 日", status: "已通过" },
        ],
      },
      建设: {
        status: "需复核",
        date: "9 月 12 日",
        approvals: [
          { title: "方案评审", owner: "平台组", date: "9 月 12 日", status: "待评审" },
        ],
      },
    }),
    deliverables: [
      { title: "自动化脚本库", owner: "VC", due: "9 月 15 日", status: "进行中" },
      { title: "告警与手册", owner: "TP", due: "9 月 18 日", status: "待开始" },
      { title: "试运行复盘报告", owner: "AL", due: "9 月 24 日", status: "待开始" },
    ],
    milestones: [
      { title: "流程蓝图确认", date: "8 月 26 日", status: "已完成" },
      { title: "自动化脚本开发", date: "9 月 12 日", status: "进行中" },
      { title: "试运行复盘", date: "9 月 24 日", status: "待开始" },
    ],
    tasks: [
      { title: "自动化告警模板", owner: "VC", status: "进行中" },
      { title: "平台稳定性优化", owner: "TP", status: "进行中" },
      { title: "客服脚本联动", owner: "AL", status: "待开始" },
    ],
    risks: [
      { title: "核心服务稳定性", level: "高" },
      { title: "自动化覆盖不足", level: "中" },
    ],
    team: [
      { name: "Avery", role: "项目负责人" },
      { name: "TP", role: "平台" },
      { name: "VC", role: "运营" },
    ],
  },
];

export function getProjectByCode(code) {
  return projects.find((project) => project.code === code);
}
