import { ActionCenterData, Task } from '../types';

const API_BASE = 'http://localhost:3001';

export async function getActionCenter(studentId: string): Promise<ActionCenterData> {
  const res = await fetch(`${API_BASE}/students/${studentId}/action-center`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function updateTaskStatus(
  taskId: string,
  status: Task['status']
): Promise<{ task: Task }> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `Request failed: ${res.status}`);
  }
  return res.json();
}
