import { Message } from '../types';

interface Props {
  messages: Message[];
  unreadCount: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessagesPanel({ messages, unreadCount }: Props) {
  const sorted = [...messages].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  return (
    <div className="card">
      <h3 className="section-title">
        Messages
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} unread</span>
        )}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map(msg => (
          <div key={msg.id} className={`message-item ${!msg.read ? 'message-unread' : ''}`}>
            {!msg.read && <div className="unread-dot" />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span className="message-from">{msg.from}</span>
                <span className="message-time">{formatDate(msg.receivedAt)}</span>
              </div>
              <p className="message-subject">{msg.subject}</p>
              <p className="message-preview">{msg.preview}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>
            No messages.
          </p>
        )}
      </div>
    </div>
  );
}
