import { render, screen } from '@testing-library/react';
import MantraProgramPage from '../app/(user)/mantraprogram/page';

describe('MantraProgramPage', () => {
  it('renders mantra program heading', () => {
    render(<MantraProgramPage />);
    expect(screen.getByRole('heading', { name: /mantra/i })).toBeInTheDocument();
  });
});
