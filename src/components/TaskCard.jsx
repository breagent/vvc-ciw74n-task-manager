import { useState } from 'react';
import PriorityBadge from './PriorityBadge.jsx';
import DeadlineDisplay from './DeadlineDisplay.jsx';
import { isOverdue, isDueSoon } from '../utils/dateUtils.js';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const overdue = isOverdue(task.deadline, task.completed);
  const dueSoon = isDueSoon(task.deadline);

  let cardClassName = 'task-card';
  if (task.completed) cardClassName += ' task-completed';
  if (overdue) cardClassName += ' task-overdue';
  if (dueSoon) cardClassName += ' task-due-soon';
  cardClassName += ` task-priority-${task.priority}`;

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(task.id);
  };

  return (
    <div className={cardClassName} onClick={() => onToggle(task.id)}>
      <div className="task-card-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="task-checkbox"
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />

        <div className="task-info">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <DeadlineDisplay
              deadline={task.deadline}
              completed={task.completed}
            />
          </div>
        </div>

        <div className="task-actions">
          <button
            className="task-menu-btn"
            onClick={handleMenuToggle}
            aria-label="Task actions"
            aria-expanded={showMenu}
          >
            ⋮
          </button>

          {showMenu && (
            <div className="task-menu-dropdown">
              <button className="menu-item" onClick={handleEdit}>
                <span className="menu-icon">✏️</span>
                <span>Edit</span>
              </button>
              <button className="menu-item menu-item-danger" onClick={handleDelete}>
                <span className="menu-icon">🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
