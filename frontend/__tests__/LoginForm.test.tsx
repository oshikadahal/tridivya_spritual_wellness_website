import { render, screen } from '@testing-library/react';
import Login from '../app/(auth)/login/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticated: false,
    loading: false,
    user: null,
  }),
}));

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });
});
