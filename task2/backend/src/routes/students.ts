import { Router, Request, Response } from 'express';
import { students, tasks, messages } from '../data/mockData';
import { Task, UrgencyLevel } from '../types';

const router = Router();

function computeUrgency(studentTasks: Task[], enrollmentStatus: string): UrgencyLevel {
  const now = new Date();
  const active = studentTasks.filter(t => t.status !== 'completed');
  const hasUrgent = active.some(t => t.priority === 'urgent');
  const hasHigh = active.some(t => t.priority === 'high');
  const hasOverdue = active.some(t => new Date(t.dueDate) < now);

  if ((hasUrgent || hasOverdue) && enrollmentStatus === 'at_risk') return 'critical';
  if (hasUrgent || (hasOverdue && hasHigh)) return 'high';
  if (hasHigh || enrollmentStatus === 'at_risk') return 'medium';
  return 'low';
}

router.get('/:id/action-center', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = students.find(s => s.id === id);

  if (!student) {
    res.status(404).json({ error: 'Student not found', requestId: req.requestId });
    return;
  }

  const studentTasks = tasks.filter(t => t.studentId === id);
  const studentMessages = messages.filter(m => m.studentId === id);
  const unreadMessagesCount = studentMessages.filter(m => !m.read).length;
  const urgencyLevel = computeUrgency(studentTasks, student.enrollmentStatus);

  res.json({
    student,
    tasks: studentTasks,
    messages: studentMessages,
    unreadMessagesCount,
    urgencyLevel,
  });
});

export default router;
