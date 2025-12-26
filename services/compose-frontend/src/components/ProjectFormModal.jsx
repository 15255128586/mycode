import { useMemo, useState } from "react";

const buildDefaults = (initialValues) => ({
  name: "",
  code: "",
  owner: "",
  due: "",
  department: "",
  desc: "",
  ...initialValues,
});

const generateProjectCode = (existingCodes) => {
  const year = new Date().getFullYear();
  let attempt = 0;
  let code = "";

  while (attempt < 10) {
    const suffix = String(Math.floor(Math.random() * 9000) + 1000);
    code = `PRJ-${year}-${suffix}`;
    if (!existingCodes.has(code.toLowerCase())) {
      return code;
    }
    attempt += 1;
  }

  return `PRJ-${year}-${Date.now().toString().slice(-4)}`;
};

export default function ProjectFormModal({
  title,
  submitLabel = "保存",
  initialValues,
  codeReadOnly = false,
  existingCodes = [],
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState(() => buildDefaults(initialValues));
  const [errors, setErrors] = useState({});

  const normalizedCodes = useMemo(
    () => new Set(existingCodes.map((code) => code.trim().toLowerCase())),
    [existingCodes]
  );

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = "请输入项目名称";
    }
    if (!form.owner.trim()) {
      nextErrors.owner = "请输入负责人";
    }

    const codeKey = form.code.trim().toLowerCase();
    if (form.code.trim() && !codeReadOnly && normalizedCodes.has(codeKey)) {
      nextErrors.code = "项目编号已存在";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const finalCode = form.code.trim()
      ? form.code.trim()
      : generateProjectCode(normalizedCodes);

    const payload = {
      name: form.name.trim(),
      code: finalCode,
      owner: form.owner.trim(),
      due: form.due.trim(),
      department: form.department.trim(),
      desc: form.desc.trim(),
    };

    onSubmit(payload);
  };

  return (
    <div className="project-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="project-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="project-modal-title">{title}</div>
        <div className="project-form-grid">
          <label className="project-form-field">
            <span className="project-form-label">项目名称</span>
            <input
              className="project-form-input"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="请输入项目名称"
            />
            {errors.name ? <span className="project-form-error">{errors.name}</span> : null}
          </label>
          <label className="project-form-field">
            <span className="project-form-label">项目编号</span>
            <input
              className="project-form-input"
              value={form.code}
              onChange={handleChange("code")}
              placeholder="例如 PRJ-2024"
              disabled={codeReadOnly}
            />
            {!codeReadOnly && !form.code.trim() ? (
              <span className="project-form-help">可留空，保存后自动生成</span>
            ) : null}
            {errors.code ? <span className="project-form-error">{errors.code}</span> : null}
          </label>
          <label className="project-form-field">
            <span className="project-form-label">负责人</span>
            <input
              className="project-form-input"
              value={form.owner}
              onChange={handleChange("owner")}
              placeholder="负责人名称"
            />
            {errors.owner ? (
              <span className="project-form-error">{errors.owner}</span>
            ) : null}
          </label>
          <label className="project-form-field">
            <span className="project-form-label">截止日期</span>
            <input
              className="project-form-input"
              value={form.due}
              onChange={handleChange("due")}
              placeholder="例如 9 月 28 日"
            />
          </label>
          <label className="project-form-field">
            <span className="project-form-label">部门</span>
            <input
              className="project-form-input"
              value={form.department}
              onChange={handleChange("department")}
              placeholder="可选"
            />
          </label>
          <label className="project-form-field project-form-field-full">
            <span className="project-form-label">项目描述</span>
            <textarea
              className="project-form-input project-form-textarea"
              rows={3}
              value={form.desc}
              onChange={handleChange("desc")}
              placeholder="补充项目背景与重点说明"
            />
          </label>
        </div>
        <div className="project-modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            取消
          </button>
          <button type="button" className="primary-button" onClick={handleSubmit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
