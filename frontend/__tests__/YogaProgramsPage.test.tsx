import { render, screen } from '@testing-library/react';
import YogaProgramsPage from '../app/(user)/yogaprograms/page';

describe('YogaProgramsPage', () => {
  it('renders yoga programs heading', () => {
    render(<YogaProgramsPage />);
    expect(screen.getByText(/loading yoga programs/i)).toBeInTheDocument();
  });
});
