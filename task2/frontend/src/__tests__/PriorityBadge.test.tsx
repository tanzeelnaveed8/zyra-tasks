import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../components/PriorityBadge';

describe('PriorityBadge', () => {
  it('renders the correct label for each priority', () => {
    const cases = [
      { priority: 'urgent', label: 'Urgent' },
      { priority: 'high',   label: 'High' },
      { priority: 'medium', label: 'Medium' },
      { priority: 'low',    label: 'Low' },
    ];

    cases.forEach(({ priority, label }) => {
      const { unmount } = render(<PriorityBadge priority={priority} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders unknown priority as-is with a fallback color', () => {
    render(<PriorityBadge priority="custom" />);
    const badge = screen.getByTestId('priority-badge');
    expect(badge).toHaveTextContent('custom');
    expect(badge).toHaveStyle({ backgroundColor: '#6b7280' });
  });
});
