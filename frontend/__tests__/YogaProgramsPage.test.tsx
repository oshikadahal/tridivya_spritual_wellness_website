import { render, screen } from '@testing-library/react';
import YogaProgramsPage from '../app/(user)/yogaprograms/page';

describe('YogaProgramsPage', () => {
  it('renders yoga programs heading', () => {
    render(<YogaProgramsPage />);
    expect(screen.getByRole('heading', { name: /yoga/i })).toBeInTheDocument();
  });
});
