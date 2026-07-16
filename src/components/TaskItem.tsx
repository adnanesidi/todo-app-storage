import React from 'react';
import { Task } from '../types';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <div className="task-details">
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-meta">
            <span className={`priority priority-${task.priority}`}>{task.priority}</span>
            <span className="category">{task.category}</span>
            {task.dueDate && <span className="due-date">{task.dueDate}</span>}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="btn-edit" title="Edit task">
          ✏️
        </button>
        <button onClick={() => onDelete(task.id)} className="btn-delete" title="Delete task">
          🗑️
        </button>
      </div>
    </div>
  );
};
