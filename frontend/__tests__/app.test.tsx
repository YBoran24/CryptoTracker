import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

describe('Home', () => {
  it('renders the homepage with correct title', () => {
    render(<Home />);
    const heading = screen.getByText(/Track Cryptocurrencies in Real-time/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Home />);
    const portfolioLink = screen.getByText('View Portfolio');
    const favoritesLink = screen.getByText('See Favorites');
    expect(portfolioLink).toBeInTheDocument();
    expect(favoritesLink).toBeInTheDocument();
  });
});