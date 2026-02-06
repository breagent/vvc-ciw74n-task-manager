import { PRIORITY_LEVELS } from '../types/task.js';

/**
 * Generate unique task ID
 * @returns {string}
 */
export function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create new task object
 * @param {Object} data - Task data
 * @returns {Task}
 */
export function createTask(data) {
  return {
    id: generateId(),
    title: data.title,
    description: data.description || '',
    deadline: data.deadline || null,
    priority: data.priority || PRIORITY_LEVELS.MEDIUM,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Update existing task
 * @param {Task} task - Existing task
 * @param {Object} updates - Updates to apply
 * @returns {Task}
 */
export function updateTask(task, updates) {
  return {
    ...task,
    ...updates,
    updatedAt: new Date()
  };
}

/**
 * Sort tasks by criteria
 * @param {Task[]} tasks - Array of tasks
 * @param {string} sortBy - Sort criterion
 * @returns {Task[]}
 */
export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks];

  switch (sortBy) {
    case 'deadline':
      return sorted.sort((a, b) => {
        const aTime = a.deadline?.getTime() || Infinity;
        const bTime = b.deadline?.getTime() || Infinity;
        return aTime - bTime;
      });

    case 'priority':
      return sorted.sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      });

    case 'created':
      return sorted.sort((a, b) => b.createdAt - a.createdAt);

    default:
      return sorted;
  }
}

/**
 * Filter tasks by completion status
 * @param {Task[]} tasks - Array of tasks
 * @param {string} filterType - Filter type (all, active, completed)
 * @returns {Task[]}
 */
export function filterTasks(tasks, filterType) {
  switch (filterType) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'all':
    default:
      return tasks;
  }
}

/**
 * Get task statistics
 * @param {Task[]} tasks - Array of tasks
 * @returns {Object}
 */
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(t => !t.completed && t.deadline && t.deadline < new Date()).length;

  return {
    total,
    completed,
    active,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

/**
 * Search tasks by query
 * @param {Task[]} tasks - Array of tasks
 * @param {string} query - Search query
 * @returns {Task[]}
 */
export function searchTasks(tasks, query) {
  if (!query.trim()) return tasks;

  const lowerQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description.toLowerCase().includes(lowerQuery)
  );
}
