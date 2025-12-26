import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useProjects } from "../state/projects.jsx";
import { FILE_MANAGER_BASE_URL, PROJECT_SERVICE_BASE_URL } from "../config.js";

const templateItems = [
  {
    title: "合同主模板 v2.1",
    meta: "包含付款、验收与违约条款",
    summary: "标准合同骨架，覆盖签订、交付、验收与付款节点。",
    highlights: ["付款节点", "验收条款", "违约责任"],
    preview: [
      "第一条 合同范围：约定服务范围、交付内容与阶段里程碑。",
      "第二条 付款与验收：明确付款节奏、验收标准及确认流程。",
      "第三条 违约责任：列明延期、质量不达标的责任条款。",
    ],
    fields: {
      项目名称: "客户旅程重构项目合同",
      开始时间: "2024-08-01",
      结束时间: "2024-12-31",
    },
  },
  {
    title: "采购合同补充条款",
    meta: "适用于外采类项目",
    summary: "外采类项目补充条款，适配供应商交付与验收。",
    highlights: ["采购范围", "交付责任", "质保约定"],
    preview: [
      "补充条款一：采购范围与规格清单按附件执行。",
      "补充条款二：供应商交付验收流程与返工责任。",
      "补充条款三：质保与售后支持约定。",
    ],
    fields: {
      合同编号: "CG-2024-0821",
    },
  },
  {
    title: "内部交付协议",
    meta: "含里程碑与交付责任",
    summary: "内部协作场景协议，强调里程碑与对接机制。",
    highlights: ["里程碑", "协作接口", "交付清单"],
    preview: [
      "里程碑一：方案确认与资源匹配。",
      "里程碑二：交付清单与对接接口。",
      "里程碑三：验收标准与交接安排。",
    ],
    fields: {
      项目编号: "PRJ-0921",
    },
  },
];

const referenceItems = [
  {
    title: "银河计划合同范本",
    meta: "2024 Q3 版本",
    project: "银河计划 · 客户旅程重构",
    readOnly: true,
    summary: "客户旅程重构项目合同，含多部门协作与渠道条款。",
    highlights: ["跨部门协作", "渠道验收", "付款节奏"],
    preview: [
      "合同目标：覆盖 5 大触点的体验升级与交付节奏。",
      "协作机制：按渠道拆分交付包，设立跨部门对齐机制。",
      "付款安排：分三期拨付，验收通过后触发。",
    ],
    fields: {
      乙方: "星河体验设计有限公司",
      中标金额: "¥12,800,000",
      合同编号: "HT-2024-0921",
      项目编号: "PRJ-0921",
    },
  },
  {
    title: "Aurora 数据合同",
    meta: "数据平台模板参考",
    project: "Aurora · 数据资产升级",
    readOnly: true,
    summary: "数据治理项目合同，重点在数据口径与验收规范。",
    highlights: ["数据口径", "验收标准", "风险条款"],
    preview: [
      "数据口径：统一指标口径与数据治理范围。",
      "验收规范：包含数据回流、口径验证与稽核。",
      "风险条款：确保数据合规与权限边界。",
    ],
    fields: {
      乙方: "Aurora 数据科技有限公司",
      中标金额: "¥9,600,000",
    },
  },
  {
    title: "Atlas 交付合同",
    meta: "交付看板项目合同",
    project: "Atlas · 交付看板重构",
    readOnly: true,
    summary: "交付看板项目合同，强调权限模型与交付节点。",
    highlights: ["权限模型", "交付节点", "上线验收"],
    preview: [
      "权限模型：明确角色与权限边界。",
      "交付节点：按看板模块分阶段交付。",
      "上线验收：联调演示通过后进入验收。",
    ],
    fields: {
      合同编号: "HT-2024-0903",
      项目编号: "PRJ-0903",
    },
  },
];

const projectLibraryItems = [
  {
    title: "项目背景说明",
    meta: "项目资料 · 可编辑",
    projectScope: "本项目",
    summary: "当前项目的背景、目标与范围说明。",
    highlights: ["项目目标", "范围边界", "关键干系人"],
    preview: [
      "项目背景：当前项目聚焦合同流程与交付规范。",
      "项目目标：确保合同可追溯、交付可验收。",
      "范围边界：覆盖合同起草、审核与签订流程。",
    ],
    fields: {
      项目名称: "银河计划 · 客户旅程重构",
      开始时间: "2024-08-01",
      结束时间: "2024-12-31",
    },
  },
  {
    title: "合同风险清单",
    meta: "风险资料 · 可编辑",
    projectScope: "本项目",
    summary: "合同相关风险点与缓释建议。",
    highlights: ["风险点", "缓释措施", "审批要求"],
    preview: [
      "风险点：供应商交付延期风险。",
      "缓释措施：增加阶段性验收节点。",
      "审批要求：关键条款需法务审核。",
    ],
    fields: {
      风险点: "交付延期",
    },
  },
];

const nodeMaterials = [
  {
    title: "合同主模板 v2.1",
    meta: "模板 · 已绑定",
    summary: "当前任务已绑定的合同模板。",
    highlights: ["合同骨架", "付款条款", "验收条款"],
    preview: [
      "合同模板已绑定，可直接生成合同草稿。",
      "建议先检查付款与验收条款。",
    ],
    fields: {
      合同编号: "HT-2024-0921",
    },
  },
  {
    title: "银河计划合同范本",
    meta: "参考 · 只读",
    summary: "绑定的参考合同，用于对照条款结构。",
    highlights: ["跨部门协作", "付款节奏"],
    preview: [
      "参考合同仅可读，用于对照条款结构。",
      "支持引用摘要与关键条款。",
    ],
    readOnly: true,
    fields: {
      乙方: "星河体验设计有限公司",
      中标金额: "¥12,800,000",
    },
  },
];

const buildMaterial = (item, options) => ({
  title: item.title,
  meta: item.meta,
  summary: item.summary,
  preview: item.preview || [],
  highlights: item.highlights || [],
  fields: item.fields || {},
  project: options.project,
  tag: options.tag,
  readOnly: options.readOnly ?? item.readOnly ?? false,
});

const buildBoundMaterial = (binding, file, projectLabel, tag) => ({
  id: binding.id,
  title: file?.filename || binding.file_id,
  meta: "上传 · 可编辑",
  summary: "已上传到项目资料库，可在编辑区打开。",
  highlights: ["上传资料", "可编辑"],
  preview: [],
  fields: {},
  project: projectLabel,
  tag,
  readOnly: false,
  fileId: binding.file_id,
});

export default function TaskWorkspace() {
  const { id, nodeId } = useParams();
  const location = useLocation();
  const [materialsView, setMaterialsView] = useState("node");
  const { projects } = useProjects();
  const project = useMemo(
    () => projects.find((item) => item.code === id),
    [id, projects]
  );
  const projectLabel = project?.name || id || "项目";
  const fileId = new URLSearchParams(location.search).get("fileId");
  const fileManagerBaseUrl = FILE_MANAGER_BASE_URL.replace(/\/+$/, "");
  const projectServiceBaseUrl = PROJECT_SERVICE_BASE_URL.replace(/\/+$/, "");
  const editorUrl = fileId
    ? `${fileManagerBaseUrl}/files/${encodeURIComponent(fileId)}/editor`
    : "";
  const [serverFiles, setServerFiles] = useState([]);
  const [materialBindings, setMaterialBindings] = useState([]);
  const [filesError, setFilesError] = useState("");
  const [bindingsError, setBindingsError] = useState("");
  const [uploadStatus, setUploadStatus] = useState({
    state: "idle",
    message: "",
  });
  const uploadInputRef = useRef(null);
  const [selectedMaterial, setSelectedMaterial] = useState(() =>
    buildMaterial(nodeMaterials[0], {
      project: project?.name || id || "本项目",
      tag: "本节点",
      readOnly: nodeMaterials[0]?.readOnly,
    })
  );

  const handlePreview = (item, options) => {
    setSelectedMaterial(buildMaterial(item, options));
  };

  const copyToClipboard = (value) => {
    if (!value) {
      return;
    }
    navigator.clipboard?.writeText(value);
  };

  const handleInsertField = (fieldKey, material = selectedMaterial) => {
    if (!material) {
      return;
    }
    const value = material.fields?.[fieldKey];
    if (!value) {
      return;
    }
    copyToClipboard(`${value}【引用：${material.title}/${fieldKey}】`);
  };

  const handleCopyField = (fieldKey, material = selectedMaterial) => {
    if (!material) {
      return;
    }
    const value = material.fields?.[fieldKey];
    if (!value) {
      return;
    }
    copyToClipboard(value);
  };

  const handleInsertSummary = (material = selectedMaterial) => {
    if (!material?.summary) {
      return;
    }
    copyToClipboard(`${material.summary}【引用：${material.title}】`);
  };

  const handleCopySummary = (material = selectedMaterial) => {
    if (!material?.summary) {
      return;
    }
    copyToClipboard(material.summary);
  };

  const handleInsertSummaryForItem = (item, options) => {
    const material = buildMaterial(item, options);
    setSelectedMaterial(material);
    handleInsertSummary(material);
  };

  const loadFiles = useCallback(async () => {
    try {
      setFilesError("");
      const response = await fetch(`${fileManagerBaseUrl}/files`);
      if (!response.ok) {
        throw new Error("fetch_failed");
      }
      const result = await response.json();
      setServerFiles(Array.isArray(result.items) ? result.items : []);
    } catch (error) {
      setFilesError("资料库加载失败");
    }
  }, [fileManagerBaseUrl]);

  const loadBindings = useCallback(async () => {
    try {
      setBindingsError("");
      const response = await fetch(
        `${projectServiceBaseUrl}/projects/${encodeURIComponent(id)}/materials`
      );
      if (!response.ok) {
        throw new Error("fetch_failed");
      }
      const result = await response.json();
      setMaterialBindings(Array.isArray(result.items) ? result.items : []);
    } catch (error) {
      setBindingsError("节点资料加载失败");
    }
  }, [id, projectServiceBaseUrl]);

  useEffect(() => {
    loadFiles();
    loadBindings();
  }, [loadBindings, loadFiles]);

  const serverFileMap = useMemo(
    () => new Map(serverFiles.map((item) => [item.id, item])),
    [serverFiles]
  );
  const nodeBindings = useMemo(
    () =>
      materialBindings
        .filter((item) => item.node_key === nodeId)
        .sort((a, b) =>
          (b.created_at || "").localeCompare(a.created_at || "")
        ),
    [materialBindings, nodeId]
  );
  const projectBindings = useMemo(
    () =>
      materialBindings
        .filter((item) => !item.node_key)
        .sort((a, b) =>
          (b.created_at || "").localeCompare(a.created_at || "")
        ),
    [materialBindings]
  );
  const nodeUploadItems = useMemo(
    () =>
      nodeBindings.map((binding) =>
        buildBoundMaterial(
          binding,
          serverFileMap.get(binding.file_id),
          projectLabel,
          "本节点"
        )
      ),
    [nodeBindings, serverFileMap, projectLabel]
  );
  const libraryUploadItems = useMemo(
    () =>
      projectBindings.map((binding) =>
        buildBoundMaterial(
          binding,
          serverFileMap.get(binding.file_id),
          projectLabel,
          "本项目"
        )
      ),
    [projectBindings, serverFileMap, projectLabel]
  );
  const statusMessage =
    uploadStatus.state !== "idle"
      ? uploadStatus
      : bindingsError
      ? { state: "error", message: bindingsError }
      : filesError
      ? { state: "error", message: filesError }
      : null;

  const handlePickUpload = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleUploadChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setFilesError("");
    setBindingsError("");
    setUploadStatus({ state: "uploading", message: "正在上传..." });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${fileManagerBaseUrl}/files`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("upload_failed");
      }
      const result = await response.json();
      const tagLabel = materialsView === "library" ? "本项目" : "本节点";
      const nodeKey = materialsView === "library" ? null : nodeId || null;
      const bindingResponse = await fetch(
        `${projectServiceBaseUrl}/projects/${encodeURIComponent(id)}/materials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            node_key: nodeKey,
            file_id: result.id,
            role: materialsView === "library" ? "project" : "node",
            project_name: projectLabel,
          }),
        }
      );
      if (!bindingResponse.ok) {
        throw new Error("binding_failed");
      }
      const binding = await bindingResponse.json();
      const nextItem = buildBoundMaterial(binding, result, projectLabel, tagLabel);
      setServerFiles((prev) => [
        result,
        ...prev.filter((item) => item.id !== result.id),
      ]);
      setSelectedMaterial(nextItem);
      setUploadStatus({ state: "success", message: "上传成功" });
      loadFiles();
      loadBindings();
    } catch (error) {
      setUploadStatus({ state: "error", message: "上传失败，请重试" });
    } finally {
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
      window.setTimeout(() => {
        setUploadStatus({ state: "idle", message: "" });
      }, 2000);
    }
  };

  return (
    <div className="workspace">
      <section className="workspace-layout">
        <div className="workspace-editor">
          <div className="workspace-editor-surface">
            {fileId ? (
              <iframe
                title="OnlyOffice 编辑器"
                className="workspace-editor-frame"
                src={editorUrl}
                allow="clipboard-read; clipboard-write"
              />
            ) : (
              <div className="workspace-editor-empty">
                <div className="workspace-editor-empty-title">
                  尚未绑定文档
                </div>
                <div className="workspace-editor-empty-note">
                  从流程图或资料库选择文件后再进入编辑。
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="workspace-side">
          <div className="panel workspace-panel">
            <div className="panel-header workspace-panel-header">
              <div>
                <div className="panel-title">参考材料</div>
                <div className="panel-subtitle">模板与历史合同</div>
              </div>
              <div className="workspace-toggle">
                <button
                  type="button"
                  className={`workspace-toggle-button ${
                    materialsView === "node" ? "active" : ""
                  }`}
                  onClick={() => setMaterialsView("node")}
                >
                  本节点
                </button>
                <button
                  type="button"
                  className={`workspace-toggle-button ${
                    materialsView === "library" ? "active" : ""
                  }`}
                  onClick={() => setMaterialsView("library")}
                >
                  项目资料库
                </button>
              </div>
            </div>
            <div className="workspace-preview">
              <div className="workspace-preview-header">
                <div>
                  <div className="workspace-preview-title">
                    {selectedMaterial?.title || "选择资料预览"}
                  </div>
                  <div className="workspace-preview-meta">
                    {selectedMaterial
                      ? `${selectedMaterial.tag} · ${selectedMaterial.project}`
                      : "从列表中选择一条材料查看摘要"}
                  </div>
                </div>
                {selectedMaterial?.readOnly ? (
                  <span className="workspace-card-tag workspace-card-tag-muted">
                    只读
                  </span>
                ) : null}
              </div>
              {selectedMaterial ? (
                <>
                  <p className="workspace-preview-summary">
                    {selectedMaterial.summary}
                  </p>
                  <div className="workspace-preview-doc">
                    {selectedMaterial.preview.map((line, index) => (
                      <p key={`${selectedMaterial.title}-${index}`}>{line}</p>
                    ))}
                  </div>
                  <div className="workspace-preview-highlights">
                    {selectedMaterial.highlights.map((item) => (
                      <span key={item} className="workspace-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="workspace-preview-fields">
                    <div className="workspace-section-title">可插入字段</div>
                    {Object.keys(selectedMaterial.fields || {}).length ? (
                      <div className="workspace-field-list">
                        {Object.entries(selectedMaterial.fields).map(
                          ([key, value]) => (
                            <div key={key} className="workspace-field-row">
                              <div>
                                <div className="workspace-field-label">
                                  {key}
                                </div>
                                <div className="workspace-field-value">
                                  {value}
                                </div>
                              </div>
                              <div className="workspace-field-actions">
                                <button
                                  type="button"
                                  className="workspace-inline-button"
                                  onClick={() => handleInsertField(key)}
                                >
                                  复制引用
                                </button>
                                <button
                                  type="button"
                                  className="workspace-inline-button"
                                  onClick={() => handleCopyField(key)}
                                >
                                  复制
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="workspace-field-empty">
                        暂无可用字段
                      </div>
                    )}
                  </div>
                  <div className="workspace-preview-actions">
                    <button
                      type="button"
                      className="workspace-inline-button"
                      onClick={() => handleInsertSummary()}
                    >
                      复制引用
                    </button>
                    <button
                      type="button"
                      className="workspace-inline-button"
                      onClick={() => handleCopySummary()}
                    >
                      复制摘要
                    </button>
                  </div>
                </>
              ) : (
                <div className="workspace-preview-empty">
                  选择一条材料查看摘要与引用字段。
                </div>
              )}
            </div>
            {materialsView === "node" ? (
              <>
                <div className="workspace-materials-actions">
                  <input
                    ref={uploadInputRef}
                    className="workspace-upload-input"
                    type="file"
                    onChange={handleUploadChange}
                  />
                  <button className="ghost-button" onClick={handlePickUpload}>
                    上传资料
                  </button>
                  <button className="secondary-button">从资料库选择</button>
                  {statusMessage ? (
                    <span
                      className={`workspace-upload-status ${statusMessage.state}`}
                    >
                      {statusMessage.message}
                    </span>
                  ) : null}
                </div>
                {nodeUploadItems.length ? (
                  <div className="workspace-section">
                    <div className="workspace-section-title">最新上传</div>
                    <div className="workspace-list">
                      {nodeUploadItems.map((item) => (
                        <div
                          key={item.id}
                          className={`workspace-card workspace-card-interactive${
                            selectedMaterial?.id === item.id ? " selected" : ""
                          }`}
                          onClick={() => setSelectedMaterial(item)}
                        >
                          <div className="workspace-card-title">
                            {item.title}
                          </div>
                          <div className="workspace-card-meta">{item.meta}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="workspace-section">
                  <div className="workspace-section-title">已绑定资料</div>
                  <div className="workspace-list">
                    {nodeMaterials.map((item) => (
                      <div
                        key={item.title}
                        className={`workspace-card workspace-card-interactive${
                          selectedMaterial?.title === item.title
                            ? " selected"
                            : ""
                        }`}
                        onClick={() =>
                          handlePreview(item, {
                            project: projectLabel,
                            tag: "本节点",
                            readOnly: item.readOnly,
                          })
                        }
                      >
                        <div className="workspace-card-title">{item.title}</div>
                        <div className="workspace-card-meta">{item.meta}</div>
                        <div className="workspace-card-actions">
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePreview(item, {
                                project: projectLabel,
                                tag: "本节点",
                                readOnly: item.readOnly,
                              });
                            }}
                          >
                            预览
                          </button>
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleInsertSummaryForItem(item, {
                                project: projectLabel,
                                tag: "本节点",
                                readOnly: item.readOnly,
                              });
                            }}
                          >
                            复制引用
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="workspace-materials-actions">
                  <input
                    className="workspace-search"
                    placeholder="搜索项目资料库"
                  />
                  <input
                    ref={uploadInputRef}
                    className="workspace-upload-input"
                    type="file"
                    onChange={handleUploadChange}
                  />
                  <button className="ghost-button" onClick={handlePickUpload}>
                    上传资料
                  </button>
                  {statusMessage ? (
                    <span
                      className={`workspace-upload-status ${statusMessage.state}`}
                    >
                      {statusMessage.message}
                    </span>
                  ) : null}
                </div>
                <div className="workspace-materials-note">
                  跨项目材料为只读，可引用后绑定到当前节点。
                </div>
                {libraryUploadItems.length ? (
                  <div className="workspace-section">
                    <div className="workspace-section-title">最新上传</div>
                    <div className="workspace-list">
                      {libraryUploadItems.map((item) => (
                        <div
                          key={item.id}
                          className={`workspace-card workspace-card-interactive${
                            selectedMaterial?.id === item.id ? " selected" : ""
                          }`}
                          onClick={() => setSelectedMaterial(item)}
                        >
                          <div className="workspace-card-title">
                            {item.title}
                          </div>
                          <div className="workspace-card-meta">{item.meta}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="workspace-section">
                  <div className="workspace-section-title">模板库</div>
                  <div className="workspace-list">
                    {templateItems.map((item) => (
                      <div
                        key={item.title}
                        className={`workspace-card workspace-card-interactive${
                          selectedMaterial?.title === item.title
                            ? " selected"
                            : ""
                        }`}
                        onClick={() =>
                          handlePreview(item, {
                            project: "模板库",
                            tag: "模板",
                          })
                        }
                      >
                        <div className="workspace-card-head">
                          <div className="workspace-card-title">{item.title}</div>
                          <div className="workspace-card-tags">
                            <span className="workspace-card-tag">模板</span>
                          </div>
                        </div>
                        <div className="workspace-card-meta">{item.meta}</div>
                        <div className="workspace-card-actions">
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePreview(item, {
                                project: "模板库",
                                tag: "模板",
                              });
                            }}
                          >
                            预览
                          </button>
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleInsertSummaryForItem(item, {
                                project: "模板库",
                                tag: "模板",
                              });
                            }}
                          >
                            复制引用
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="workspace-section">
                  <div className="workspace-section-title">本项目资料库</div>
                  <div className="workspace-list">
                    {projectLibraryItems.map((item) => (
                      <div
                        key={item.title}
                        className={`workspace-card workspace-card-interactive${
                          selectedMaterial?.title === item.title
                            ? " selected"
                            : ""
                        }`}
                        onClick={() =>
                          handlePreview(item, {
                            project: projectLabel,
                            tag: "本项目",
                          })
                        }
                      >
                        <div className="workspace-card-head">
                          <div className="workspace-card-title">{item.title}</div>
                          <div className="workspace-card-tags">
                            <span className="workspace-card-tag">本项目</span>
                          </div>
                        </div>
                        <div className="workspace-card-meta">{item.meta}</div>
                        <div className="workspace-card-actions">
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePreview(item, {
                                project: projectLabel,
                                tag: "本项目",
                              });
                            }}
                          >
                            预览
                          </button>
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleInsertSummaryForItem(item, {
                                project: projectLabel,
                                tag: "本项目",
                              });
                            }}
                          >
                            复制引用
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="workspace-section">
                  <div className="workspace-section-title">跨项目参考</div>
                  <div className="workspace-list">
                    {referenceItems.map((item) => (
                      <div
                        key={item.title}
                        className={`workspace-card workspace-card-interactive${
                          selectedMaterial?.title === item.title
                            ? " selected"
                            : ""
                        }`}
                        onClick={() =>
                          handlePreview(item, {
                            project: item.project,
                            tag: "跨项目",
                            readOnly: item.readOnly,
                          })
                        }
                      >
                        <div className="workspace-card-head">
                          <div className="workspace-card-title">{item.title}</div>
                          <div className="workspace-card-tags">
                            <span className="workspace-card-tag">跨项目</span>
                            {item.readOnly ? (
                              <span className="workspace-card-tag workspace-card-tag-muted">
                                只读
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="workspace-card-meta">
                          {item.meta} · {item.project}
                        </div>
                        <div className="workspace-card-actions">
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePreview(item, {
                                project: item.project,
                                tag: "跨项目",
                                readOnly: item.readOnly,
                              });
                            }}
                          >
                            预览
                          </button>
                          <button
                            type="button"
                            className="workspace-inline-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleInsertSummaryForItem(item, {
                                project: item.project,
                                tag: "跨项目",
                                readOnly: item.readOnly,
                              });
                            }}
                          >
                            复制引用
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </aside>
      </section>
    </div>
  );
}
