import { useState, useCallback, useEffect } from 'react';
import { Task, TaskFilter, Statistics } from '../types';
import { getTasks, saveTasks, addTask as storageAddTask, updateTask as storageUpdateTask, deleteTask as storageDeleteTask } from '../utils/storage';

/**
 * Custom hook for managing tasks
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize tasks from storage
  useEffect(() => {
    const storedTasks = getTasks();
    setTasks(storedTasks);
  }, []);

  // Filter and search tasks
  const getFilteredTasks = useCallback((): Task[] => {
    let filtered = tasks;

    // Apply filter
    switch (filter) {
      case 'completed':
        filtered = tasks.filter(t => t.completed);
        break;
      case 'pending':
        filtered = tasks.filter(t => !t.completed);
        break;
      case 'high-priority':
        filtered = tasks.filter(t => t.priority === 'high' && !t.completed);
        break;
      case 'due-today': {
        const today = new Date().toISOString().split('T')[0];
        filtered = tasks.filter(t => t.dueDate === today && !t.completed);
        break;
      }
      case 'overdue': {
        const today = new Date().toISOString().split('T')[0];
        filtered = tasks.filter(t => t.dueDate < today && !t.completed);
        break;
      }
      default:
        filtered = tasks;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, filter, searchQuery]);

  // Get statistics
  const getStatistics = useCallback((): Statistics => {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => t.dueDate < today && !t.completed).length;

    return {
      total,
      completed,
      pending,
      completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      highPriority,
      overdue,
    };
  }, [tasks]);

  // Add task
  const addTask = useCallback((task: Task) => {
    const newTasks = storageAddTask(task);
    setTasks(newTasks);
  }, []);

  // Update task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const newTasks = storageUpdateTask(id, updates);
    setTasks(newTasks);
  }, []);

  // Delete task
  const deleteTask = useCallback((id: string) => {
    const newTasks = storageDeleteTask(id);
    setTasks(newTasks);
  }, []);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : undefined,
      });
    }
  }, [tasks, updateTask]);

  return {
    tasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    getFilteredTasks,
    getStatistics,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};
