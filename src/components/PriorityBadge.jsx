export default function PriorityBadge({ priority }) {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  const icons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };

  return (
    <span className={`priority-badge priority-${priority}`} aria-label={`${labels[priority]} priority`}>
      <span className="priority-icon">{icons[priority]}</span>
      <span className="priority-label">{labels[priority]}</span>
    </span>
  );
}
