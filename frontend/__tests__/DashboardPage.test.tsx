import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/(user)/dashboard/page';

describe('DashboardPage', () => {
  it('renders dashboard heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
