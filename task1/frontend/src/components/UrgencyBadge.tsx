import { UrgencyLevel } from '../types';

interface Props {
  level: UrgencyLevel;
}

const config: Record<UrgencyLevel, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5', label: 'Critical' },
  high:     { bg: '#fff7ed', text: '#9a3412', border: '#fdba74', label: 'High Priority' },
  medium:   { bg: '#fffbeb', text: '#92400e', border: '#fcd34d', label: 'Medium Priority' },
  low:      { bg: '#f0fdf4', text: '#166534', border: '#86efac', label: 'Low Priority' },
};

export function UrgencyBadge({ level }: Props) {
  const { bg, text, border, label } = config[level];
  return (
    <span style={{
      backgroundColor: bg,
      color: text,
      border: `1px solid ${border}`,
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
    }}>
      {label}
    </span>
  );
}
