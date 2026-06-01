import { render, screen } from '@testing-library/react';
import { MessagesPanel } from '../components/MessagesPanel';
import { Message } from '../types';

const mockMessages: Message[] = [
  {
    id: 'msg_001',
    studentId: 'stu_001',
    from: 'Mrs. Thompson',
    subject: 'Missing assignments',
    preview: 'Student has not submitted...',
    read: false,
    receivedAt: '2026-05-30T08:30:00Z',
  },
  {
    id: 'msg_002',
    studentId: 'stu_001',
    from: 'Admin Office',
    subject: 'Absence notification',
    preview: 'Student was marked absent...',
    read: true,
    receivedAt: '2026-05-29T08:30:00Z',
  },
];

describe('MessagesPanel', () => {
  it('renders all messages', () => {
    render(<MessagesPanel messages={mockMessages} unreadCount={1} />);
    expect(screen.getByText('Missing assignments')).toBeInTheDocument();
    expect(screen.getByText('Absence notification')).toBeInTheDocument();
  });

  it('shows the unread badge with correct count', () => {
    render(<MessagesPanel messages={mockMessages} unreadCount={1} />);
    expect(screen.getByTestId('unread-badge')).toHaveTextContent('1 unread');
  });

  it('hides the unread badge when count is zero', () => {
    render(<MessagesPanel messages={mockMessages} unreadCount={0} />);
    expect(screen.queryByTestId('unread-badge')).not.toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    render(<MessagesPanel messages={[]} unreadCount={0} />);
    expect(screen.getByText('No messages.')).toBeInTheDocument();
  });

  it('shows sender names', () => {
    render(<MessagesPanel messages={mockMessages} unreadCount={1} />);
    expect(screen.getByText('Mrs. Thompson')).toBeInTheDocument();
    expect(screen.getByText('Admin Office')).toBeInTheDocument();
  });
});
