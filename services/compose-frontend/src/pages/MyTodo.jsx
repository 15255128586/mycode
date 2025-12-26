export default function MyTodo() {
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">我的待办</div>
            <div className="panel-subtitle">聚合需要你处理的项目事项</div>
          </div>
          <button className="ghost-button">同步待办</button>
        </div>
        <div className="placeholder-body">
          <p>待办将从流程节点、交付物与审批任务自动汇总。</p>
          <div className="placeholder-grid">
            <div>
              <div className="placeholder-metric">0</div>
              <div className="placeholder-label">待处理事项</div>
            </div>
            <div>
              <div className="placeholder-metric">0</div>
              <div className="placeholder-label">本周到期</div>
            </div>
            <div>
              <div className="placeholder-metric">0</div>
              <div className="placeholder-label">高优先级</div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">待办列表</div>
              <div className="panel-subtitle">等待接入实际任务数据</div>
            </div>
            <button className="ghost-button">筛选</button>
          </div>
          <div className="empty-state">
            <div className="panel-title">暂无待办</div>
            <div className="panel-subtitle">从项目列表进入流程图并创建任务。</div>
            <button className="secondary-button">查看项目</button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">待办来源</div>
              <div className="panel-subtitle">将按类型汇总并生成提醒</div>
            </div>
          </div>
          <div className="placeholder-body">
            <div className="placeholder-grid">
              <div>
                <div className="placeholder-metric">流程节点</div>
                <div className="placeholder-label">待补充说明/材料</div>
              </div>
              <div>
                <div className="placeholder-metric">交付物</div>
                <div className="placeholder-label">待上传/待归档</div>
              </div>
              <div>
                <div className="placeholder-metric">审批</div>
                <div className="placeholder-label">待评审/待签字</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
