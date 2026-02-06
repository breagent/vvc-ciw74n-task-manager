export default function EmptyState({ filterType }) {
  const messages = {
    all: {
      icon: '📝',
      title: 'No tasks yet',
      description: 'Create your first task to get started'
    },
    active: {
      icon: '✨',
      title: 'All caught up!',
      description: 'No active tasks at the moment'
    },
    completed: {
      icon: '🎯',
      title: 'No completed tasks',
      description: 'Complete some tasks to see them here'
    }
  };

  const message = messages[filterType] || messages.all;

  return (
    <div className="empty-state">
      <div className="empty-icon">{message.icon}</div>
      <h2 className="empty-title">{message.title}</h2>
      <p className="empty-description">{message.description}</p>
    </div>
  );
}
