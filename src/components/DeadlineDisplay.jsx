import { formatDeadline, isOverdue, isDueSoon } from '../utils/dateUtils.js';

export default function DeadlineDisplay({ deadline, completed }) {
  const formattedDeadline = formatDeadline(deadline);
  const overdue = isOverdue(deadline, completed);
  const dueSoon = isDueSoon(deadline);

  let className = 'deadline-display';
  let icon = '📅';

  if (overdue) {
    className += ' deadline-overdue';
    icon = '⚠️';
  } else if (dueSoon) {
    className += ' deadline-due-soon';
    icon = '⏰';
  } else if (completed) {
    className += ' deadline-completed';
    icon = '✓';
  }

  return (
    <span className={className}>
      <span className="deadline-icon">{icon}</span>
      <span className="deadline-text">{formattedDeadline}</span>
    </span>
  );
}
