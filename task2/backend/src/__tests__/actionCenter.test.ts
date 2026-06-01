import request from 'supertest';
import app from '../app';

describe('GET /students/:id/action-center', () => {
  it('returns full action center data for a valid student', async () => {
    const res = await request(app).get('/students/stu_001/action-center');

    expect(res.status).toBe(200);
    expect(res.body.student.id).toBe('stu_001');
    expect(res.body.student.name).toBe('Maya Patel');
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(typeof res.body.unreadMessagesCount).toBe('number');
    expect(['low', 'medium', 'high', 'critical']).toContain(res.body.urgencyLevel);
  });

  it('only returns tasks and messages belonging to the requested student', async () => {
    const res = await request(app).get('/students/stu_002/action-center');

    expect(res.status).toBe(200);
    res.body.tasks.forEach((t: { studentId: string }) => {
      expect(t.studentId).toBe('stu_002');
    });
    res.body.messages.forEach((m: { studentId: string }) => {
      expect(m.studentId).toBe('stu_002');
    });
  });

  it('unreadMessagesCount matches actual unread messages', async () => {
    const res = await request(app).get('/students/stu_001/action-center');

    const actualUnread = res.body.messages.filter((m: { read: boolean }) => !m.read).length;
    expect(res.body.unreadMessagesCount).toBe(actualUnread);
  });

  it('returns X-Request-ID header on every response', async () => {
    const res = await request(app).get('/students/stu_001/action-center');

    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it('returns 404 with requestId for an unknown student', async () => {
    const res = await request(app).get('/students/stu_999/action-center');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Student not found');
    expect(res.body.requestId).toBeDefined();
  });

  it('computes critical urgency for at_risk student with urgent tasks', async () => {
    const res = await request(app).get('/students/stu_001/action-center');

    // stu_001 is at_risk and has urgent tasks
    expect(res.body.student.enrollmentStatus).toBe('at_risk');
    expect(res.body.urgencyLevel).toBe('critical');
  });
});

describe('PATCH /tasks/:taskId/status', () => {
  it('updates task status and returns updated task', async () => {
    const res = await request(app)
      .patch('/tasks/tsk_004/status')
      .send({ status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.task.id).toBe('tsk_004');
    expect(res.body.task.status).toBe('in_progress');
    expect(res.body.task.updatedAt).toBeDefined();
  });

  it('persists the status change (subsequent GET reflects update)', async () => {
    await request(app).patch('/tasks/tsk_009/status').send({ status: 'completed' });

    const res = await request(app).get('/students/stu_002/action-center');
    const tsk009 = res.body.tasks.find((t: { id: string }) => t.id === 'tsk_009');
    expect(tsk009.status).toBe('completed');
  });

  it('returns 400 for an invalid status value', async () => {
    const res = await request(app)
      .patch('/tasks/tsk_001/status')
      .send({ status: 'not_a_real_status' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid status');
    expect(res.body.requestId).toBeDefined();
  });

  it('returns 400 when status field is missing from body', async () => {
    const res = await request(app).patch('/tasks/tsk_001/status').send({});

    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown task', async () => {
    const res = await request(app)
      .patch('/tasks/tsk_999/status')
      .send({ status: 'completed' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });
});
