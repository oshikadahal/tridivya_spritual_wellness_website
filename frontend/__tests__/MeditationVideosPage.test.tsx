import { render, screen } from '@testing-library/react';
import MeditationVideosPage from '../app/(user)/meditationvideos/page';

describe('MeditationVideosPage', () => {
  it('renders meditation videos heading', () => {
    render(<MeditationVideosPage />);
    expect(screen.getByText(/loading meditation videos/i)).toBeInTheDocument();
  });
});
