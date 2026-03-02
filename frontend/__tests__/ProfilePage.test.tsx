import { render, screen } from '@testing-library/react';
import ProfilePage from '../app/(user)/profile-edit/page';

describe('ProfilePage', () => {
  it('renders profile heading', () => {
    render(<ProfilePage />);
    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
  });
});
