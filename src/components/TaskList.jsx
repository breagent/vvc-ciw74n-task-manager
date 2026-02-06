import TaskCard from './TaskCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, filterType }) {
  if (tasks.length === 0) {
    return <EmptyState filterType={filterType} />;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
