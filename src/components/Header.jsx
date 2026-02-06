export default function Header({ onNewTask, taskStats }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">Task Manager</h1>
          {taskStats && (
            <div className="header-stats">
              <span className="stat-badge">
                {taskStats.active} active
              </span>
              <span className="stat-separator">•</span>
              <span className="stat-badge">
                {taskStats.completed} completed
              </span>
            </div>
          )}
        </div>
        <button className="btn-new" onClick={onNewTask} aria-label="Create new task">
          <span className="btn-icon">+</span>
          <span className="btn-text">New Task</span>
        </button>
      </div>
    </header>
  );
}
