interface Props {
  priority: string;
}

const config: Record<string, { bg: string; label: string }> = {
  urgent: { bg: '#dc2626', label: 'Urgent' },
  high:   { bg: '#ea580c', label: 'High' },
  medium: { bg: '#ca8a04', label: 'Medium' },
  low:    { bg: '#16a34a', label: 'Low' },
};

export function PriorityBadge({ priority }: Props) {
  const { bg, label } = config[priority] ?? { bg: '#6b7280', label: priority };
  return (
    <span
      data-testid="priority-badge"
      style={{
        backgroundColor: bg,
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
