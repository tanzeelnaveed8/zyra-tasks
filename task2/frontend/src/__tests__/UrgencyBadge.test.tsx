import { render, screen } from '@testing-library/react';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { UrgencyLevel } from '../types';

describe('UrgencyBadge', () => {
  const cases: { level: UrgencyLevel; label: string }[] = [
    { level: 'critical', label: 'Critical' },
    { level: 'high',     label: 'High Priority' },
    { level: 'medium',   label: 'Medium Priority' },
    { level: 'low',      label: 'Low Priority' },
  ];

  cases.forEach(({ level, label }) => {
    it(`renders "${label}" for level "${level}"`, () => {
      render(<UrgencyBadge level={level} />);
      expect(screen.getByTestId('urgency-badge')).toHaveTextContent(label);
    });
  });
});
