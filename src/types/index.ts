export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export type TaskFilter = 'all' | 'completed' | 'pending' | 'high-priority' | 'due-today' | 'overdue';

export type TaskCategory = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Finance' | 'Other';

export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  completionPercentage: number;
  highPriority: number;
  overdue: number;
}
