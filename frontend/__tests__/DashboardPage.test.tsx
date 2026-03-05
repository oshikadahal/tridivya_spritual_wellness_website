import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/(user)/dashboard/page';

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    loading: false,
    user: { id: 'u1', firstName: 'Test' },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/api/content', () => ({
  listYogas: jest.fn().mockResolvedValue({ data: [] }),
  listMeditations: jest.fn().mockResolvedValue({ data: [] }),
  listMantras: jest.fn().mockResolvedValue({ data: [] }),
  getYogaProgress: jest.fn().mockResolvedValue([]),
  getMeditationProgress: jest.fn().mockResolvedValue([]),
  getMantraProgress: jest.fn().mockResolvedValue([]),
}));

describe('DashboardPage', () => {
  it('renders dashboard heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /recommended for you/i })).toBeInTheDocument();
  });
});
