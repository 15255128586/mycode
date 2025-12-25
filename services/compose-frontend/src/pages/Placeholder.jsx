export default function Placeholder({ title, subtitle, note }) {
  return (
    <section className="placeholder panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">{title}</div>
          <div className="panel-subtitle">{subtitle}</div>
        </div>
        <button className="ghost-button">配置</button>
      </div>
      <div className="placeholder-body">
        <p>{note}</p>
        <div className="placeholder-grid">
          <div>
            <div className="placeholder-metric">4</div>
            <div className="placeholder-label">待处理事项</div>
          </div>
          <div>
            <div className="placeholder-metric">12</div>
            <div className="placeholder-label">关联项目</div>
          </div>
          <div>
            <div className="placeholder-metric">7</div>
            <div className="placeholder-label">待同步节点</div>
          </div>
        </div>
      </div>
    </section>
  );
}
