import { Student, UrgencyLevel } from '../types';
import { UrgencyBadge } from './UrgencyBadge';

interface Props {
  student: Student;
  urgencyLevel: UrgencyLevel;
  unreadCount: number;
}

export function StudentProfile({ student, urgencyLevel, unreadCount }: Props) {
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div className="avatar">{initials}</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            {student.name}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>
            {student.email}
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-stat">
          <span className="stat-label">Grade</span>
          <span className="stat-value">{student.grade}</span>
        </div>
        <div className="profile-stat">
          <span className="stat-label">GPA</span>
          <span className="stat-value">{student.gpa.toFixed(1)}</span>
        </div>
        <div className="profile-stat">
          <span className="stat-label">Unread Messages</span>
          <span className="stat-value" style={{ color: unreadCount > 0 ? '#dc2626' : '#111827' }}>
            {unreadCount}
          </span>
        </div>
        <div className="profile-stat">
          <span className="stat-label">Status</span>
          <span className={`enrollment-status ${student.enrollmentStatus === 'at_risk' ? 'at-risk' : 'active'}`}>
            {student.enrollmentStatus === 'at_risk' ? 'At Risk' : 'Active'}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginRight: '8px' }}>
          Urgency Level:
        </span>
        <UrgencyBadge level={urgencyLevel} />
      </div>
    </div>
  );
}
