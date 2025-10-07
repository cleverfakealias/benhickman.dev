import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import Header from '../layout/Header';

// Mock getDomainConfig to always use the default domain for tests
jest.mock('../../config/domainConfig', () => ({
  getDomainConfig: () => ({
    formspreeUrl: 'test-formspree-url',
    recaptchaSiteKey: 'test-recaptcha-key',
    branding: {
      name: 'Zengineer',
      logo: '/images/zengineer dark logo 2.png',
      alt: 'Zengineer monogram logo',
      subtitle: 'Cloud Software Development',
    },
  }),
}));

const theme = createMnTheme('light');

import { MemoryRouter } from 'react-router-dom';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>
  );
};

// Mock props for Header component
const mockProps = {
  themeMode: 'light' as const,
  setThemeMode: jest.fn(),
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation links', () => {
    renderWithTheme(<Header {...mockProps} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders logo and branding', () => {
    renderWithTheme(<Header {...mockProps} />);

    expect(screen.getByText('Zengineer')).toBeInTheDocument();
    expect(screen.getByText('Cloud Software Development')).toBeInTheDocument();
  });

  test('renders social links', () => {
    renderWithTheme(<Header {...mockProps} />);

    // Check for social links (LinkedIn and GitHub)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithTheme(<Header {...mockProps} />);

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
    expect(screen.getByText('Experience').closest('a')).toHaveAttribute('href', '/experience');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
  });
});
