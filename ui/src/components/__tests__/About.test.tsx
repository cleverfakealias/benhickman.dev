import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import About from '../../pages/About';

const renderWithTheme = (component: React.ReactElement) => {
  const theme = createMnTheme('light');
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('About', () => {
  test('renders About Me heading', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  test('renders introduction text', () => {
    renderWithTheme(<About />);
    expect(
      screen.getByText(/I’m a seasoned software engineer with over 15 years in tech/)
    ).toBeInTheDocument();
  });

  test('renders What I Bring section', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('What I Bring')).toBeInTheDocument();
  });

  test('renders Technical Skills section', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
  });

  test('renders Enterprise SaaS Experience', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('Enterprise SaaS Experience')).toBeInTheDocument();
  });

  test('renders System Architecture', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('System Architecture')).toBeInTheDocument();
  });

  test('renders Cloud-Native Development', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('Cloud-Native Development')).toBeInTheDocument();
  });

  test('renders Full-Stack Development', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('Full-Stack Development')).toBeInTheDocument();
  });

  test('renders React skill', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('renders TypeScript skill', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('renders AWS skill', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  test('renders Docker skill', () => {
    renderWithTheme(<About />);
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  test('renders main heading with correct text', () => {
    renderWithTheme(<About />);
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('About Me');

    const subHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(subHeadings).toHaveLength(2); // Technical Skills and What I Bring
  });
});
