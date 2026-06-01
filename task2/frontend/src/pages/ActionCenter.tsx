import { useState, useEffect, useCallback } from 'react';
import { ActionCenterData, Task } from '../types';
import { getActionCenter } from '../api/client';
import { StudentProfile } from '../components/StudentProfile';
import { TaskList } from '../components/TaskList';
import { MessagesPanel } from '../components/MessagesPanel';

const STUDENTS = [
  { id: 'stu_001', name: 'Maya Patel' },
  { id: 'stu_002', name: 'Jordan Lee' },
  { id: 'stu_003', name: 'Carlos Rivera' },
];

export function ActionCenter() {
  const [selectedId, setSelectedId] = useState('stu_001');
  const [data, setData] = useState<ActionCenterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await getActionCenter(id);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(selectedId);
  }, [selectedId, load]);

  function handleTaskUpdated(updatedTask: Task) {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)),
      };
    });
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="header-title">Counselor Student Action Center</h1>
            <p className="header-subtitle">Student overview, tasks, and messages at a glance</p>
          </div>
          <div className="student-tabs">
            {STUDENTS.map(s => (
              <button
                key={s.id}
                className={`tab-btn ${selectedId === s.id ? 'tab-active' : ''}`}
                onClick={() => setSelectedId(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div className="center-state">
            <div className="spinner" />
            <p>Loading student data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="center-state">
            <div className="error-card">
              <p style={{ margin: 0, fontWeight: 600, color: '#991b1b' }}>Failed to load data</p>
              <p style={{ margin: '4px 0 12px', color: '#b91c1c', fontSize: '14px' }}>{error}</p>
              <button className="retry-btn" onClick={() => load(selectedId)}>Retry</button>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="grid">
            <div className="col-left">
              <StudentProfile
                student={data.student}
                urgencyLevel={data.urgencyLevel}
                unreadCount={data.unreadMessagesCount}
              />
            </div>
            <div className="col-center">
              <TaskList tasks={data.tasks} onTaskUpdated={handleTaskUpdated} />
            </div>
            <div className="col-right">
              <MessagesPanel messages={data.messages} unreadCount={data.unreadMessagesCount} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
