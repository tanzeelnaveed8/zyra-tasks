import { useState } from 'react';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { updateTaskStatus } from '../api/client';

interface Props {
  tasks: Task[];
  onTaskUpdated: (updatedTask: Task) => void;
}

const STATUS_OPTIONS: Task['status'][] = ['todo', 'in_progress', 'completed'];

const STATUS_LABELS: Record<Task['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(dueDate: string, status: Task['status']) {
  return status !== 'completed' && new Date(dueDate) < new Date();
}

export function TaskList({ tasks, onTaskUpdated }: Props) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  async function handleStatusChange(taskId: string, newStatus: Task['status']) {
    setUpdating(taskId);
    setError(null);
    try {
      const { task } = await updateTaskStatus(taskId, newStatus);
      onTaskUpdated(task);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update task');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="card">
      <h3 className="section-title">Tasks <span className="count-badge">{tasks.length}</span></h3>

      {error && <div className="error-banner">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map(task => (
          <div
            key={task.id}
            className={`task-item ${task.status === 'completed' ? 'task-completed' : ''}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span className={`task-title ${task.status === 'completed' ? 'task-title-done' : ''}`}>
                    {task.title}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>
                <p className="task-description">{task.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <span className={`due-date ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
                    Due: {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate, task.status) && ' (Overdue)'}
                  </span>
                </div>
              </div>

              <select
                className="status-select"
                value={task.status}
                disabled={updating === task.id}
                onChange={e => handleStatusChange(task.id, e.target.value as Task['status'])}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>
            No tasks assigned.
          </p>
        )}
      </div>
    </div>
  );
}
