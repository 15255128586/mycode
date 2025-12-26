export default function AutoReport() {
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">自动报告</div>
            <div className="panel-subtitle">自动整理项目进展，生成周报与月报</div>
          </div>
          <button className="ghost-button">更新数据</button>
        </div>
        <div className="placeholder-body">
          <p>报告将基于项目阶段、交付物和风险状态自动汇总。</p>
          <div className="placeholder-grid">
            <div>
              <div className="placeholder-metric">0</div>
              <div className="placeholder-label">本周完成</div>
            </div>
            <div>
              <div className="placeholder-metric">0</div>
              <div className="placeholder-label">本月完成</div>
            </div>
            <div>
              <div className="placeholder-metric">0</div>
              <div className="placeholder-label">需关注事项</div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-grid secondary">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">周报</div>
              <div className="panel-subtitle">自动整理本周已完成事项</div>
            </div>
            <button className="primary-button">生成周报</button>
          </div>
          <div className="placeholder-body">
            <p>周报将按项目聚合完成情况与风险更新。</p>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">月报</div>
              <div className="panel-subtitle">自动整理本月关键进展</div>
            </div>
            <button className="primary-button">生成月报</button>
          </div>
          <div className="placeholder-body">
            <p>月报将输出阶段性成果与资源需求摘要。</p>
          </div>
        </div>
      </section>
    </>
  );
}
