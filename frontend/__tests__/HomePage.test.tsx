import { render, screen } from '@testing-library/react';
import HomePage from '../app/(public)/page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /find your inner peace and balance/i })).toBeInTheDocument();
  });
});
