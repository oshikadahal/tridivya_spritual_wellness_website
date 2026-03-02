import { render, screen } from '@testing-library/react';
import Sidebar from '../app/(user)/_components/Sidebar';

describe('Sidebar', () => {
  it('renders sidebar menu', () => {
    render(<Sidebar />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/meditation videos/i)).toBeInTheDocument();
    expect(screen.getByText(/yoga programs/i)).toBeInTheDocument();
  });
});
