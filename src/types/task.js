/**
 * Task type definitions
 * @typedef {'high' | 'medium' | 'low'} Priority
 *
 * @typedef {Object} Task
 * @property {string} id - Unique task identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {Date|null} deadline - Task deadline
 * @property {Priority} priority - Task priority level
 * @property {boolean} completed - Whether task is completed
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 *
 * @typedef {Object} TaskFilters
 * @property {'all' | 'active' | 'completed'} active - Filter by completion status
 * @property {'deadline' | 'priority' | 'created'} sortBy - Sort criterion
 */

export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const FILTER_TYPES = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export const SORT_OPTIONS = {
  DEADLINE: 'deadline',
  PRIORITY: 'priority',
  CREATED: 'created'
};
