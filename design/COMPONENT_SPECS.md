# Task Manager - Component Specifications

## Developer Implementation Guide

This document provides detailed specifications for implementing the Task Manager UI components. Use this alongside the UI_UX_DESIGN.md for complete implementation details.

---

## Component Architecture

### Component Tree
```
App
├── Header
│   └── NewTaskButton
├── FilterBar
│   ├── TabGroup
│   └── SortDropdown
├── TaskList
│   ├── TaskCard (multiple)
│   │   ├── Checkbox
│   │   ├── PriorityBadge
│   │   ├── TaskTitle
│   │   ├── TaskMeta
│   │   │   ├── DeadlineDisplay
│   │   │   └── PriorityLabel
│   │   ├── TaskDescription (optional)
│   │   └── TaskMenu
│   └── EmptyState (conditional)
└── TaskModal
    ├── ModalBackdrop
    └── TaskForm
        ├── TextInput
        ├── TextArea
        ├── DateTimePicker
        ├── RadioGroup
        └── FormActions
```

---

## Component Specifications

### 1. Header Component

**Purpose**: Main app header with title and new task button

**Props**: None

**State**: None

**HTML Structure**:
```html
<header class="header">
  <h1>Task Manager</h1>
  <button class="btn-new" onClick={handleNewTask}>
    + New Task
  </button>
</header>
```

**CSS Classes**:
- `.header`: Flexbox container, white background, rounded corners
- `.btn-new`: Primary blue button with hover effects

**Events**:
- `onClick`: Opens task creation modal

**Accessibility**:
- `<h1>` for semantic heading
- Button has visible focus state
- Keyboard shortcut: Ctrl/Cmd + N

---

### 2. FilterBar Component

**Purpose**: Filter and sort controls for task list

**Props**:
```javascript
{
  activeFilter: 'all' | 'active' | 'completed',
  sortBy: 'deadline' | 'priority' | 'created',
  onFilterChange: (filter: string) => void,
  onSortChange: (sort: string) => void
}
```

**State**:
- `activeTab`: Current active filter tab
- `selectedSort`: Current sort option

**HTML Structure**:
```html
<div class="filters">
  <div class="tabs">
    <button class="tab" :class="{active: activeFilter === 'all'}">
      All Tasks
    </button>
    <button class="tab" :class="{active: activeFilter === 'active'}">
      Active
    </button>
    <button class="tab" :class="{active: activeFilter === 'completed'}">
      Completed
    </button>
  </div>
  <div class="sort-controls">
    <label>Sort by:</label>
    <select v-model="sortBy" @change="onSortChange">
      <option value="deadline">Deadline</option>
      <option value="priority">Priority</option>
      <option value="created">Date Created</option>
    </select>
  </div>
</div>
```

**Behavior**:
- Tab click updates activeFilter
- Select change triggers sort function
- Active tab shows blue underline

---

### 3. TaskCard Component

**Purpose**: Display individual task with all details

**Props**:
```javascript
{
  task: {
    id: string,
    title: string,
    description?: string,
    deadline: Date | null,
    priority: 'high' | 'medium' | 'low',
    completed: boolean,
    createdAt: Date,
    updatedAt: Date
  },
  onToggleComplete: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
}
```

**Computed Properties**:
```javascript
{
  isOverdue: boolean,     // deadline < now && !completed
  isDueSoon: boolean,     // deadline within 24 hours
  deadlineText: string,   // formatted deadline display
  priorityColor: string   // color based on priority
}
```

**HTML Structure**:
```html
<div class="task-card"
     :class="{
       'priority-high': task.priority === 'high',
       'priority-medium': task.priority === 'medium',
       'priority-low': task.priority === 'low',
       'overdue': isOverdue,
       'due-soon': isDueSoon,
       'completed': task.completed
     }">
  <input type="checkbox"
         :checked="task.completed"
         @change="onToggleComplete(task.id)"
         class="task-checkbox" />

  <div class="task-content">
    <div class="task-header">
      <span class="priority-badge" :class="task.priority">
        {{ priorityIcon }}
      </span>
      <h3 class="task-title">{{ task.title }}</h3>
      <button class="task-menu" @click="openMenu">⋮</button>
    </div>

    <div class="task-meta">
      <span class="task-deadline" :class="{overdue: isOverdue, 'due-soon': isDueSoon}">
        📅 Due: {{ deadlineText }}
      </span>
      <span>•</span>
      <span class="task-priority-label">{{ priorityLabel }}</span>
    </div>

    <div v-if="task.description" class="task-description">
      {{ task.description }}
    </div>
  </div>
</div>
```

**Methods**:
```javascript
{
  formatDeadline(date: Date): string {
    const now = new Date();
    const diff = date - now;

    if (diff < 0) return 'Yesterday';
    if (diff < 86400000) return 'Today, ' + formatTime(date);
    if (diff < 172800000) return 'Tomorrow, ' + formatTime(date);
    return formatDate(date);
  },

  getPriorityIcon(priority: string): string {
    const icons = { high: '!', medium: '-', low: '·' };
    return icons[priority];
  },

  openMenu(): void {
    // Show dropdown with Edit/Delete options
  }
}
```

**Animations**:
- Slide in on mount (300ms)
- Hover lift effect (transform: translateY(-1px))
- Checkbox fill animation on complete
- Strikethrough animation on title when completed

---

### 4. TaskModal Component

**Purpose**: Form for creating or editing tasks

**Props**:
```javascript
{
  isOpen: boolean,
  task?: Task,  // If editing, otherwise undefined for new task
  onClose: () => void,
  onSubmit: (task: Task) => void
}
```

**State**:
```javascript
{
  title: string,
  description: string,
  deadline: Date | null,
  deadlineTime: string,
  priority: 'high' | 'medium' | 'low',
  errors: {
    title?: string,
    deadline?: string
  }
}
```

**HTML Structure**:
```html
<div class="modal-backdrop" v-if="isOpen" @click.self="onClose">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">{{ task ? 'Edit Task' : 'Add New Task' }}</h2>
      <button class="modal-close" @click="onClose">✕</button>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">
          Task Title <span class="required">*</span>
        </label>
        <input
          type="text"
          v-model="title"
          class="form-input"
          :class="{error: errors.title}"
          placeholder="Enter task name..."
          required
          maxlength="200"
        />
        <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label class="form-label">Description (optional)</label>
        <textarea
          v-model="description"
          class="form-textarea"
          placeholder="Add details..."
          maxlength="1000"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Deadline</label>
        <div class="form-row">
          <input
            type="date"
            v-model="deadline"
            class="form-input"
          />
          <input
            type="time"
            v-model="deadlineTime"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Priority</label>
        <div class="radio-group">
          <div class="radio-option">
            <input type="radio" v-model="priority" value="high" id="high" />
            <label for="high">High</label>
          </div>
          <div class="radio-option">
            <input type="radio" v-model="priority" value="medium" id="medium" />
            <label for="medium">Medium</label>
          </div>
          <div class="radio-option">
            <input type="radio" v-model="priority" value="low" id="low" />
            <label for="low">Low</label>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" @click="onClose">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          {{ task ? 'Save Changes' : 'Add Task' }}
        </button>
      </div>
    </form>
  </div>
</div>
```

**Validation**:
```javascript
validateForm(): boolean {
  const errors = {};

  if (!this.title.trim()) {
    errors.title = 'Title is required';
  }

  if (this.deadline && new Date(this.deadline) < new Date()) {
    // Show warning, don't block
    const confirmed = confirm('This deadline is in the past. Continue anyway?');
    if (!confirmed) return false;
  }

  this.errors = errors;
  return Object.keys(errors).length === 0;
}
```

**Methods**:
```javascript
{
  handleSubmit(): void {
    if (!this.validateForm()) return;

    const task = {
      id: this.task?.id || generateId(),
      title: this.title.trim(),
      description: this.description.trim(),
      deadline: this.combineDateTime(this.deadline, this.deadlineTime),
      priority: this.priority,
      completed: this.task?.completed || false,
      createdAt: this.task?.createdAt || new Date(),
      updatedAt: new Date()
    };

    this.onSubmit(task);
    this.resetForm();
    this.onClose();
  },

  combineDateTime(date: string, time: string): Date | null {
    if (!date) return null;
    return new Date(`${date}T${time || '00:00'}`);
  },

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.deadline = null;
    this.deadlineTime = '';
    this.priority = 'medium';
    this.errors = {};
  }
}
```

**Accessibility**:
- Focus trap within modal
- Escape key closes modal
- First input auto-focused on open
- Required fields marked with asterisk
- ARIA labels on form controls

---

### 5. PriorityBadge Component

**Purpose**: Visual indicator for task priority

**Props**:
```javascript
{
  priority: 'high' | 'medium' | 'low',
  variant: 'circle' | 'badge' // Default: circle
}
```

**HTML Structure**:
```html
<!-- Circle variant -->
<span class="priority-badge" :class="priority">
  {{ icon }}
</span>

<!-- Badge variant -->
<span class="priority-badge-text" :class="priority">
  {{ label }}
</span>
```

**Styles**:
```css
.priority-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.priority-badge.high {
  background: #dc2626;
  color: white;
}

.priority-badge.medium {
  background: #f59e0b;
  color: white;
}

.priority-badge.low {
  background: #10b981;
  color: white;
}
```

---

### 6. DeadlineDisplay Component

**Purpose**: Format and display task deadline with status

**Props**:
```javascript
{
  deadline: Date | null,
  completed: boolean
}
```

**Computed**:
```javascript
{
  isOverdue: boolean,
  isDueSoon: boolean,
  formattedText: string,
  statusClass: string
}
```

**HTML Structure**:
```html
<span class="task-deadline" :class="statusClass">
  📅 Due: {{ formattedText }}
</span>
```

**Date Formatting Logic**:
```javascript
formatDeadline(date: Date): string {
  if (!date) return 'No deadline';

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours < -24) {
    return 'Yesterday';
  } else if (hours < 0) {
    return 'Earlier today';
  } else if (hours < 24) {
    return `Today, ${this.formatTime(date)}`;
  } else if (hours < 48) {
    return `Tomorrow, ${this.formatTime(date)}`;
  } else {
    return this.formatDate(date);
  }
}

formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}
```

---

### 7. EmptyState Component

**Purpose**: Display when no tasks match current filter

**Props**:
```javascript
{
  type: 'no-tasks' | 'all-complete' | 'no-results',
  onAction?: () => void
}
```

**HTML Structure**:
```html
<div class="empty-state">
  <div class="empty-state-icon">{{ icon }}</div>
  <h3 class="empty-state-title">{{ title }}</h3>
  <p class="empty-state-text">{{ message }}</p>
  <button v-if="showAction" class="btn btn-primary" @click="onAction">
    {{ actionText }}
  </button>
</div>
```

**Content Map**:
```javascript
{
  'no-tasks': {
    icon: '✓',
    title: 'No tasks yet!',
    message: 'Create your first task to get started',
    actionText: 'Create Task',
    showAction: true
  },
  'all-complete': {
    icon: '🎉',
    title: 'All done!',
    message: "You've completed all your tasks",
    showAction: false
  },
  'no-results': {
    icon: '🔍',
    title: 'No tasks found',
    message: 'Try adjusting your filters',
    showAction: false
  }
}
```

---

## State Management

### Application State

```javascript
{
  tasks: Task[],
  filters: {
    active: 'all' | 'active' | 'completed',
    sortBy: 'deadline' | 'priority' | 'created'
  },
  ui: {
    modalOpen: boolean,
    editingTask: string | null,
    loading: boolean
  }
}
```

### Actions

```javascript
{
  // Task CRUD
  addTask(task: Task): void,
  updateTask(id: string, updates: Partial<Task>): void,
  deleteTask(id: string): void,
  toggleTaskComplete(id: string): void,

  // Filtering & Sorting
  setFilter(filter: string): void,
  setSortBy(sort: string): void,

  // UI
  openModal(taskId?: string): void,
  closeModal(): void,

  // Persistence
  loadTasks(): Promise<void>,
  saveTasks(): Promise<void>
}
```

### Computed/Derived State

```javascript
{
  filteredTasks: Task[] => {
    return tasks
      .filter(task => {
        if (filters.active === 'active') return !task.completed;
        if (filters.active === 'completed') return task.completed;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'deadline') {
          return (a.deadline || Infinity) - (b.deadline || Infinity);
        }
        if (filters.sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.createdAt - a.createdAt;
      });
  },

  overdueTasks: Task[] => {
    return tasks.filter(t => !t.completed && t.deadline && t.deadline < new Date());
  },

  taskStats: Object => {
    return {
      total: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      overdue: overdueTasks.length
    };
  }
}
```

---

## Data Persistence

### LocalStorage Schema

```javascript
const STORAGE_KEY = 'taskManager';

const storage = {
  tasks: Task[],
  settings: {
    defaultPriority: 'medium',
    sortBy: 'deadline',
    showCompleted: true
  },
  version: '1.0'
};
```

### Save/Load Methods

```javascript
class TaskStorage {
  save(tasks: Task[]): void {
    const data = {
      tasks: tasks.map(t => ({
        ...t,
        deadline: t.deadline?.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      })),
      version: '1.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  load(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.tasks.map(t => ({
      ...t,
      deadline: t.deadline ? new Date(t.deadline) : null,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    }));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
```

---

## Utility Functions

### Date Utilities

```javascript
// Check if date is today
function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Check if date is tomorrow
function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

// Get relative time difference
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.abs(diff / (1000 * 60 * 60));

  if (hours < 1) return 'in less than an hour';
  if (hours < 24) return `in ${Math.floor(hours)} hours`;
  const days = Math.floor(hours / 24);
  return `in ${days} day${days > 1 ? 's' : ''}`;
}
```

### ID Generation

```javascript
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### String Utilities

```javascript
function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Task creation with all fields
- [ ] Task creation with minimal fields
- [ ] Task completion toggle
- [ ] Task deletion
- [ ] Deadline formatting (all cases)
- [ ] Priority badge rendering
- [ ] Filter logic (all, active, completed)
- [ ] Sort logic (deadline, priority, created)
- [ ] Form validation
- [ ] LocalStorage save/load

### Integration Tests
- [ ] Create task flow (open modal → fill form → submit)
- [ ] Edit task flow (click menu → edit → save)
- [ ] Complete task flow (check → update → move to completed)
- [ ] Delete task flow (click menu → delete → confirm)
- [ ] Filter switching updates list
- [ ] Sort switching reorders list
- [ ] Modal opens and closes correctly
- [ ] Data persists across page refresh

### E2E Tests
- [ ] New user sees empty state
- [ ] Can create first task
- [ ] Task appears in list
- [ ] Can mark task complete
- [ ] Can edit task
- [ ] Can delete task
- [ ] Overdue task shows red indicator
- [ ] Due soon task shows orange indicator
- [ ] Filters work as expected
- [ ] Mobile responsive layout

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announces task status
- [ ] Color contrast meets WCAG AA
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] Modal focus trap works
- [ ] Skip navigation available

---

## Performance Optimization

### Best Practices
1. **Virtual Scrolling**: Implement for lists > 100 tasks
2. **Debounce Search**: 300ms delay on search input
3. **Memoization**: Cache filtered/sorted lists
4. **Lazy Loading**: Load tasks in batches
5. **Optimistic Updates**: Update UI before server response

### Code Splitting
```javascript
// Lazy load modal
const TaskModal = lazy(() => import('./TaskModal'));

// Lazy load empty state
const EmptyState = lazy(() => import('./EmptyState'));
```

### Rendering Optimization
```javascript
// Use React.memo for task cards
export default React.memo(TaskCard, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.completed === nextProps.task.completed &&
         prevProps.task.updatedAt === nextProps.task.updatedAt;
});
```

---

## Browser Support

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

### Polyfills Needed
- None (using modern ES6+ features with transpilation)

---

## Deployment Checklist

- [ ] All tests passing
- [ ] Build optimized (minified, tree-shaken)
- [ ] Assets compressed (gzip)
- [ ] Source maps generated
- [ ] Environment variables configured
- [ ] Error tracking set up (Sentry)
- [ ] Analytics configured (optional)
- [ ] PWA manifest and service worker (optional)
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable (Lighthouse)

---

## Maintenance & Updates

### Version History
- v1.0.0: Initial release with core features
- v1.1.0: Add deadline functionality (current)
- v1.2.0 (planned): Categories and tags
- v2.0.0 (planned): Backend sync and collaboration

### Known Issues
- None at launch

### Future Improvements
See UI_UX_DESIGN.md Phase 2 enhancements section

---

This component specification should provide developers with everything needed to implement the Task Manager UI accurately and efficiently.
