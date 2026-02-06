const STORAGE_KEY = 'taskManager';
const STORAGE_VERSION = '1.0';

/**
 * Serialize task for storage
 */
function serializeTask(task) {
  return {
    ...task,
    deadline: task.deadline?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}

/**
 * Deserialize task from storage
 */
function deserializeTask(task) {
  return {
    ...task,
    deadline: task.deadline ? new Date(task.deadline) : null,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt)
  };
}

/**
 * Storage utility for persisting tasks
 */
export const storage = {
  /**
   * Save tasks to localStorage
   * @param {Task[]} tasks - Array of tasks to save
   */
  save(tasks) {
    try {
      const data = {
        tasks: tasks.map(serializeTask),
        version: STORAGE_VERSION
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save tasks:', error);
      throw new Error('Storage quota exceeded or localStorage unavailable');
    }
  },

  /**
   * Load tasks from localStorage
   * @returns {Task[]} Array of tasks
   */
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      // Version migration logic could go here
      if (parsed.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, migrating data...');
      }

      return parsed.tasks.map(deserializeTask);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  },

  /**
   * Clear all tasks from storage
   */
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear tasks:', error);
    }
  },

  /**
   * Check if storage is available
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Clean up old completed tasks to save space
 * @param {Task[]} tasks - Array of tasks
 * @param {number} daysToKeep - Number of days to keep completed tasks (default: 30)
 * @returns {Task[]} Filtered tasks
 */
export function cleanupOldTasks(tasks, daysToKeep = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  return tasks.filter(task =>
    !task.completed || task.updatedAt > cutoffDate
  );
}
