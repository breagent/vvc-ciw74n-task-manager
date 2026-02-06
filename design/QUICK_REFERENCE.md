# Task Manager - Quick Reference Card

## Colors

```css
/* Priority Colors */
--color-priority-high: #dc2626    /* Red */
--color-priority-medium: #f59e0b  /* Amber */
--color-priority-low: #10b981     /* Green */

/* Status Colors */
--color-overdue: #991b1b          /* Dark Red */
--color-due-soon: #f97316         /* Orange */
--color-completed: #9ca3af        /* Gray */

/* UI Colors */
--color-primary: #2563eb          /* Blue - buttons, links */
--color-bg-primary: #f9fafb       /* Page background */
--color-surface: #ffffff          /* Cards, modals */
--color-text-primary: #111827     /* Main text */
--color-text-secondary: #6b7280   /* Secondary text */
```

## Spacing

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-6: 24px
--spacing-8: 32px
```

## Typography

```css
/* Sizes */
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-2xl: 24px

/* Weights */
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

## Components

### TaskCard Props
```typescript
{
  task: Task,
  onToggleComplete: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
}
```

### Task Type
```typescript
interface Task {
  id: string
  title: string
  description?: string
  deadline: Date | null
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Date Formatting

```javascript
// Today: "Today, 3:00 PM"
// Tomorrow: "Tomorrow, 10:00 AM"
// Future: "Feb 10, 2:00 PM"
// Overdue: "Yesterday" (in red)

import { formatDeadline } from './utils/dateUtils';
const text = formatDeadline(task.deadline);
```

## CSS Classes

```css
/* Task Card States */
.task-card.priority-high    /* Red left border */
.task-card.priority-medium  /* Amber left border */
.task-card.priority-low     /* Green left border */
.task-card.overdue          /* Pink background */
.task-card.due-soon         /* Amber background */
.task-card.completed        /* Gray, strikethrough */
```

## Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter/Space**: Activate button or checkbox
- **Escape**: Close modal
- **Ctrl/Cmd + N**: New task (optional)

## Breakpoints

```css
/* Mobile */
@media (max-width: 767px)

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px)

/* Desktop */
@media (min-width: 1024px)
```

## Animation Timing

```css
--duration-fast: 100ms      /* Button clicks */
--duration-normal: 200ms    /* Hover effects */
--duration-slow: 300ms      /* Modal open/close */
```

## Common Patterns

### Creating a Task
```javascript
const newTask = {
  id: generateId(),
  title: "Task title",
  description: "Optional description",
  deadline: new Date("2026-02-10T14:00"),
  priority: "medium",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Filtering Tasks
```javascript
const activeTasks = tasks.filter(t => !t.completed);
const completedTasks = tasks.filter(t => t.completed);
```

### Sorting by Deadline
```javascript
const sorted = tasks.sort((a, b) => {
  const aTime = a.deadline?.getTime() || Infinity;
  const bTime = b.deadline?.getTime() || Infinity;
  return aTime - bTime;
});
```

### Checking Overdue
```javascript
const isOverdue = (task) => {
  return task.deadline &&
    !task.completed &&
    task.deadline < new Date();
};
```

## File Imports

```javascript
// Design tokens
import '../styles/design-tokens.css';

// Utilities
import { formatDeadline, isOverdue } from '../utils/dateUtils';
import { storage } from '../utils/storage';

// Components
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
```

## Accessibility

```html
<!-- Required attributes -->
<button aria-label="Add new task">+</button>
<input aria-required="true" />
<div role="alert" aria-live="polite">Task created</div>

<!-- Focus management -->
<div className="focus:ring-2 focus:ring-blue-500">
```

## Testing Shortcuts

```javascript
// Clear all tasks
localStorage.removeItem('taskManager');

// Add test task
const testTask = {
  id: 'test-1',
  title: 'Test Task',
  deadline: new Date(),
  priority: 'high',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## Priority Badge Icons

- High: `!` (exclamation)
- Medium: `-` (dash)
- Low: `·` (dot)

## Common Mixins

```css
/* Card shadow on hover */
.card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

/* Focus ring */
.focusable:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Smooth transition */
.animated {
  transition: all 200ms ease-out;
}
```

## Documentation Links

- Full Design: `UI_UX_DESIGN.md`
- Components: `COMPONENT_SPECS.md`
- Implementation: `IMPLEMENTATION_GUIDE.md`
- Interactive: `design-mockup.html`

---

**Quick tip**: Open `design-mockup.html` in your browser while coding for instant visual reference!
