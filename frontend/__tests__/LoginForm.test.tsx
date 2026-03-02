import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../app/(auth)/login/page';

// Adjust import path if your Login component is elsewhere

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows error on empty submit', () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });
});
