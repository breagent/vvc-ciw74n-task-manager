import { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage.js';
import { createTask, updateTask as updateTaskUtil, sortTasks, filterTasks, getTaskStats } from '../utils/taskUtils.js';
import { FILTER_TYPES, SORT_OPTIONS } from '../types/task.js';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    active: FILTER_TYPES.ALL,
    sortBy: SORT_OPTIONS.DEADLINE
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = storage.load();
    setTasks(loadedTasks);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || storage.load().length > 0) {
      storage.save(tasks);
    }
  }, [tasks]);

  // Add new task
  const addTask = (taskData) => {
    const newTask = createTask(taskData);
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  // Update existing task
  const updateTask = (id, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? updateTaskUtil(task, updates) : task
      )
    );
  };

  // Delete task
  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  // Handle task submission (create or update)
  const handleTaskSubmit = (taskData) => {
    if (taskData.id) {
      // Update existing task
      updateTask(taskData.id, taskData);
    } else {
      // Create new task
      addTask(taskData);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  // Open modal for new task
  const openNewTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Open modal for editing task
  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  // Get filtered and sorted tasks
  const filteredTasks = sortTasks(
    filterTasks(tasks, filters.active),
    filters.sortBy
  );

  // Get task statistics
  const taskStats = getTaskStats(tasks);

  const value = {
    tasks,
    filteredTasks,
    filters,
    modalOpen,
    editingTask,
    taskStats,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    handleTaskSubmit,
    openNewTaskModal,
    openEditTaskModal,
    closeModal,
    setFilters
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
