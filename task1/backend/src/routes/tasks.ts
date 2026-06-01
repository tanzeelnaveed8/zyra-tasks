import { Router, Request, Response } from 'express';
import { tasks } from '../data/mockData';

const router = Router();

const VALID_STATUSES = ['todo', 'in_progress', 'completed'] as const;

router.patch('/:taskId/status', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }

  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    status,
    updatedAt: new Date().toISOString(),
  };

  res.json({ task: tasks[taskIndex] });
});

export default router;
