import { Task } from '../types';

const STORAGE_KEY = 'todo_tasks';
const VERSION_KEY = 'todo_version';
const CURRENT_VERSION = '1.0.0';

/**
 * Initialize storage if it doesn't exist
 */
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
};

/**
 * Get all tasks from storage
 */
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error reading tasks from storage:', error);
    return [];
  }
};

/**
 * Save tasks to storage
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    } else {
      console.error('Error saving tasks to storage:', error);
    }
  }
};

/**
 * Add a new task
 */
export const addTask = (task: Task): Task[] => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
};

/**
 * Update a task
 */
export const updateTask = (id: string, updates: Partial<Task>): Task[] => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
  }
  return tasks;
};

/**
 * Delete a task
 */
export const deleteTask = (id: string): Task[] => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  saveTasks(filtered);
  return filtered;
};

/**
 * Clear all tasks
 */
export const clearAllTasks = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};

/**
 * Export tasks as JSON
 */
export const exportTasks = (): string => {
  const tasks = getTasks();
  return JSON.stringify(tasks, null, 2);
};

/**
 * Import tasks from JSON
 */
export const importTasks = (jsonData: string): Task[] | null => {
  try {
    const tasks = JSON.parse(jsonData);
    if (Array.isArray(tasks)) {
      saveTasks(tasks);
      return tasks;
    }
    return null;
  } catch (error) {
    console.error('Error importing tasks:', error);
    return null;
  }
};

/**
 * Get storage info
 */
export const getStorageInfo = (): { used: number; available: number; percentage: number } => {
  const used = new Blob([JSON.stringify(getTasks())]).size;
  const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
  return {
    used,
    available,
    percentage: (used / available) * 100,
  };
};
