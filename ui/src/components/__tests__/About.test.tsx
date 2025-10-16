import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import About from '../../pages/About';

const renderAbout = () => {
  const theme = createMnTheme('light');
  return render(
    <ThemeProvider theme={theme}>
      <About />
    </ThemeProvider>
  );
};

describe('About', () => {
  test('renders core content and structure (single render)', () => {
    renderAbout();

    // Main heading
    expect(screen.getByRole('heading', { level: 1, name: /about me/i })).toBeInTheDocument();

    // Section headings
    expect(
      screen.getByRole('heading', { level: 2, name: /technical skills/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /what i bring/i })).toBeInTheDocument();

    // Ensure only the two expected level-2 headings exist
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);

    // Key intro text snippet
    expect(
      screen.getByText(/I’m a seasoned software engineer with over 15 years in tech/i)
    ).toBeInTheDocument();

    // Highlights (card titles are level 3 headings)
    const highlights = [
      'Enterprise SaaS Experience',
      'System Architecture',
      'Cloud-Native Development',
      'Full-Stack Development',
    ];
    highlights.forEach((title) => {
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument();
    });

    // Representative skills chips
    ['React', 'TypeScript', 'AWS', 'Docker'].forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });
});
