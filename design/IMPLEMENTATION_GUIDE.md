# Task Manager - Implementation Guide

## Quick Start for Developers

This guide helps you get started implementing the Task Manager UI/UX design.

---

## File Structure Overview

```
task-manager/
├── design/
│   ├── UI_UX_DESIGN.md          # Complete design specification
│   ├── COMPONENT_SPECS.md       # Detailed component specifications
│   ├── design-tokens.css        # CSS variables and design system
│   ├── design-mockup.html       # Interactive HTML mockup
│   └── IMPLEMENTATION_GUIDE.md  # This file
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── FilterBar.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   ├── PriorityBadge.jsx
│   │   ├── DeadlineDisplay.jsx
│   │   └── EmptyState.jsx
│   ├── hooks/
│   │   ├── useTasks.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── taskUtils.js
│   │   └── storage.js
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── globals.css
│   │   └── components.css
│   ├── types/
│   │   └── task.ts
│   └── App.jsx
├── public/
│   └── index.html
└── package.json
```

---

## Step-by-Step Implementation

### Phase 1: Setup (Day 1)

#### 1. Initialize Project

```bash
# Using React + Vite
npm create vite@latest task-manager -- --template react

# OR using Next.js
npx create-next-app@latest task-manager

# OR using Vue
npm create vue@latest task-manager
```

#### 2. Install Dependencies

```bash
npm install
npm install --save-dev tailwindcss postcss autoprefixer  # Optional
```

#### 3. Set Up Design System

1. Copy `design-tokens.css` to `src/styles/tokens.css`
2. Import in main CSS file:

```css
/* src/styles/globals.css */
@import './tokens.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-primary);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
}
```

#### 4. Create Type Definitions

```typescript
// src/types/task.ts
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: Date | null;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilters {
  active: 'all' | 'active' | 'completed';
  sortBy: 'deadline' | 'priority' | 'created';
}
```

---

### Phase 2: Core Components (Days 2-3)

#### 1. Create Task Data Model

```javascript
// src/utils/taskUtils.js
export function createTask(data) {
  return {
    id: generateId(),
    title: data.title,
    description: data.description || '',
    deadline: data.deadline || null,
    priority: data.priority || 'medium',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

#### 2. Implement Storage Layer

```javascript
// src/utils/storage.js
const STORAGE_KEY = 'taskManager';

export const storage = {
  save(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tasks: tasks.map(serializeTask),
      version: '1.0'
    }));
  },

  load() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.tasks.map(deserializeTask);
  }
};

function serializeTask(task) {
  return {
    ...task,
    deadline: task.deadline?.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}

function deserializeTask(task) {
  return {
    ...task,
    deadline: task.deadline ? new Date(task.deadline) : null,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt)
  };
}
```

#### 3. Build Header Component

```jsx
// src/components/Header.jsx
export default function Header({ onNewTask }) {
  return (
    <header className="header">
      <h1>Task Manager</h1>
      <button className="btn-new" onClick={onNewTask}>
        + New Task
      </button>
    </header>
  );
}
```

#### 4. Build Task Card Component

Reference `COMPONENT_SPECS.md` section 3 for complete implementation.

```jsx
// src/components/TaskCard.jsx
import PriorityBadge from './PriorityBadge';
import DeadlineDisplay from './DeadlineDisplay';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const isOverdue = task.deadline && task.deadline < new Date() && !task.completed;
  const isDueSoon = task.deadline &&
    (task.deadline - new Date()) < 86400000 && // 24 hours
    task.deadline > new Date();

  return (
    <div className={`task-card priority-${task.priority} ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''} ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />

      <div className="task-content">
        <div className="task-header">
          <PriorityBadge priority={task.priority} />
          <h3 className="task-title">{task.title}</h3>
          <button className="task-menu" onClick={() => openMenu()}>⋮</button>
        </div>

        <div className="task-meta">
          <DeadlineDisplay
            deadline={task.deadline}
            completed={task.completed}
          />
          <span>•</span>
          <span className="task-priority-label">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
        </div>

        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
      </div>
    </div>
  );
}
```

---

### Phase 3: State Management (Day 4)

#### React Context Approach

```jsx
// src/context/TaskContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    active: 'all',
    sortBy: 'deadline'
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = storage.load();
    setTasks(loadedTasks);
  }, []);

  // Save tasks on change
  useEffect(() => {
    storage.save(tasks);
  }, [tasks]);

  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    updateTask(id, {
      completed: !tasks.find(t => t.id === id).completed
    });
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filters.active === 'active') return !task.completed;
      if (filters.active === 'completed') return task.completed;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        const aTime = a.deadline?.getTime() || Infinity;
        const bTime = b.deadline?.getTime() || Infinity;
        return aTime - bTime;
      }
      if (filters.sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return b.createdAt - a.createdAt;
    });

  const value = {
    tasks,
    filteredTasks,
    filters,
    modalOpen,
    editingTask,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setFilters,
    setModalOpen,
    setEditingTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
```

---

### Phase 4: Modal & Forms (Day 5)

#### Task Modal Implementation

See `COMPONENT_SPECS.md` section 4 for complete modal specifications.

```jsx
// src/components/TaskModal.jsx
import { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, task, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    deadlineTime: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        deadline: task.deadline ? formatDate(task.deadline) : '',
        deadlineTime: task.deadline ? formatTime(task.deadline) : '',
        priority: task.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        deadlineTime: '',
        priority: 'medium'
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    const deadline = formData.deadline
      ? new Date(`${formData.deadline}T${formData.deadlineTime || '00:00'}`)
      : null;

    onSubmit({
      ...task,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline,
      priority: formData.priority
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form fields - see full implementation in COMPONENT_SPECS.md */}
        </form>
      </div>
    </div>
  );
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}
```

---

### Phase 5: Utilities & Polish (Day 6)

#### Date Utilities

```javascript
// src/utils/dateUtils.js
export function formatDeadline(date) {
  if (!date) return 'No deadline';

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours < -24) return 'Yesterday';
  if (hours < 0) return 'Earlier today';
  if (hours < 24) return `Today, ${formatTime(date)}`;
  if (hours < 48) return `Tomorrow, ${formatTime(date)}`;

  return formatDate(date);
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

export function isOverdue(date, completed) {
  if (!date || completed) return false;
  return date < new Date();
}

export function isDueSoon(date) {
  if (!date) return false;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return diff > 0 && diff < 86400000; // Within 24 hours
}
```

---

### Phase 6: Testing (Day 7)

#### Unit Test Example

```javascript
// src/utils/dateUtils.test.js
import { formatDeadline, isOverdue, isDueSoon } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDeadline', () => {
    it('returns "No deadline" for null', () => {
      expect(formatDeadline(null)).toBe('No deadline');
    });

    it('formats today correctly', () => {
      const today = new Date();
      today.setHours(14, 30);
      expect(formatDeadline(today)).toContain('Today');
    });

    it('formats tomorrow correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatDeadline(tomorrow)).toContain('Tomorrow');
    });
  });

  describe('isOverdue', () => {
    it('returns true for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isOverdue(yesterday, false)).toBe(true);
    });

    it('returns false for completed tasks', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isOverdue(yesterday, true)).toBe(false);
    });
  });
});
```

---

## Development Workflow

### Daily Checklist

**Day 1**: Project setup, design system integration
**Day 2**: Core components (Header, TaskCard, FilterBar)
**Day 3**: Task list, empty states, layout
**Day 4**: State management, CRUD operations
**Day 5**: Modal form, validation
**Day 6**: Date utilities, polish, animations
**Day 7**: Testing, bug fixes, documentation

### Code Review Checklist

- [ ] All components match design specifications
- [ ] Colors use CSS variables from design tokens
- [ ] Spacing follows design system
- [ ] Hover states implemented
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Mobile responsive
- [ ] Tests passing
- [ ] No console errors

---

## Common Pitfalls & Solutions

### 1. Date Handling Issues

**Problem**: Dates not displaying correctly across timezones

**Solution**: Store dates as ISO strings, convert to Date objects when needed

```javascript
// Always serialize before storing
const serialized = date.toISOString();

// Always parse when retrieving
const parsed = new Date(serialized);
```

### 2. LocalStorage Limits

**Problem**: Exceeding localStorage 5-10MB limit

**Solution**: Implement data cleanup for old completed tasks

```javascript
function cleanupOldTasks(tasks) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return tasks.filter(task =>
    !task.completed || task.completedAt > thirtyDaysAgo
  );
}
```

### 3. Performance with Many Tasks

**Problem**: List rendering slow with 500+ tasks

**Solution**: Implement virtual scrolling or pagination

```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={tasks.length}
  itemSize={100}
>
  {({ index, style }) => (
    <div style={style}>
      <TaskCard task={tasks[index]} />
    </div>
  )}
</FixedSizeList>
```

### 4. Modal Focus Management

**Problem**: Focus escapes modal, keyboard trap not working

**Solution**: Use focus trap library or implement manually

```javascript
import FocusTrap from 'focus-trap-react';

<FocusTrap>
  <div className="modal">
    {/* Modal content */}
  </div>
</FocusTrap>
```

---

## Debugging Tips

### 1. Task Not Appearing

- Check localStorage: `localStorage.getItem('taskManager')`
- Verify filtering logic
- Check sort function

### 2. Deadline Display Wrong

- Log raw date value: `console.log(task.deadline)`
- Check timezone conversions
- Verify date parsing in storage

### 3. Modal Not Opening

- Check `isOpen` prop value
- Verify z-index stacking
- Check for blocking CSS

---

## Browser DevTools Tips

### React DevTools

1. Install React DevTools extension
2. Inspect component props and state
3. Use Profiler to identify performance issues

### Chrome DevTools

```javascript
// View all stored tasks
JSON.parse(localStorage.getItem('taskManager'))

// Clear all tasks
localStorage.removeItem('taskManager')

// Manually add test task
localStorage.setItem('taskManager', JSON.stringify({
  tasks: [{
    id: 'test',
    title: 'Test Task',
    deadline: new Date().toISOString(),
    priority: 'high',
    completed: false
  }],
  version: '1.0'
}))
```

---

## Resources

### Documentation
- [UI_UX_DESIGN.md](./UI_UX_DESIGN.md) - Complete design specification
- [COMPONENT_SPECS.md](./COMPONENT_SPECS.md) - Detailed component specs
- [design-tokens.css](./design-tokens.css) - Design system variables

### Interactive Mockup
- Open [design-mockup.html](./design-mockup.html) in browser to see interactive design

### Libraries to Consider
- **date-fns**: Date manipulation and formatting
- **React Hook Form**: Form validation
- **Framer Motion**: Smooth animations
- **React Window**: Virtual scrolling for large lists
- **Focus Trap React**: Accessible modal focus management

---

## Deployment

### Build for Production

```bash
# Build
npm run build

# Preview build locally
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## Next Steps After MVP

1. Add backend API for data sync
2. Implement user authentication
3. Add categories/tags for tasks
4. Create recurring tasks feature
5. Build mobile app (React Native)
6. Add push notifications
7. Create calendar view
8. Implement task sharing/collaboration

---

## Support & Questions

For design-related questions:
- Reference UI_UX_DESIGN.md for visual specifications
- Check COMPONENT_SPECS.md for implementation details
- Review design-mockup.html for interactive examples

For implementation help:
- Check component specifications in COMPONENT_SPECS.md
- Review utility functions in the codebase
- Reference this implementation guide

---

**Happy Coding!** Build something awesome.
