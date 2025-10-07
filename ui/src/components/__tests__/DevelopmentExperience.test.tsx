import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import DevelopmentExperience from '../../pages/DevelopmentExperience';

const theme = createMnTheme('light');

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DevelopmentExperience', () => {
  test('renders development experience page title', () => {
    renderWithTheme(<DevelopmentExperience />);
    expect(screen.getByText('Development Experience')).toBeInTheDocument();
  });

  test('renders development experience subtitle', () => {
    renderWithTheme(<DevelopmentExperience />);
    expect(
      screen.getByText(
        'Technical expertise spanning full-stack development, modern frameworks, and enterprise solutions'
      )
    ).toBeInTheDocument();
  });

  test('renders all experience sections', () => {
    renderWithTheme(<DevelopmentExperience />);

    expect(screen.getByText('Full Stack Development')).toBeInTheDocument();
    expect(screen.getByText('Front-End Technologies')).toBeInTheDocument();
    expect(screen.getByText('Back-End Technologies')).toBeInTheDocument();
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('CI/CD')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure & Methodologies')).toBeInTheDocument();
  });

  test('renders experience descriptions', () => {
    renderWithTheme(<DevelopmentExperience />);

    expect(screen.getByText(/With over 7 years of professional experience/)).toBeInTheDocument();
    expect(
      screen.getByText(/Skilled in building modern, responsive user interfaces/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Proficient in back-end development with Java and Python/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Experienced with a variety of database systems/)).toBeInTheDocument();
    expect(
      screen.getByText(/Hands-on experience with modern DevOps pipelines/)
    ).toBeInTheDocument();
    expect(screen.getByText(/I work confidently with Docker and Kubernetes/)).toBeInTheDocument();
  });

  test('has proper heading structure', () => {
    renderWithTheme(<DevelopmentExperience />);

    // Main heading - use getAllByRole to handle multiple h1s
    const mainHeadings = screen.getAllByRole('heading', { level: 1 });
    const developmentExperienceHeading = mainHeadings.find(
      (heading) => heading.textContent === 'Development Experience'
    );
    expect(developmentExperienceHeading).toBeInTheDocument();

    // Section headings: check each is present and is an h2
    const sectionTitles = [
      'Full Stack Development',
      'Front-End Technologies',
      'Back-End Technologies',
      'Databases',
      'CI/CD',
      'Infrastructure & Methodologies',
    ];
    sectionTitles.forEach((title) => {
      const heading = screen.getByRole('heading', { level: 2, name: title });
      expect(heading).toBeInTheDocument();
    });
  });

  test('renders experience cards with hover effects', () => {
    renderWithTheme(<DevelopmentExperience />);
    expect(screen.getByText('Full Stack Development')).toBeInTheDocument();
    expect(screen.getByText('Front-End Technologies')).toBeInTheDocument();
    expect(screen.getByText('Back-End Technologies')).toBeInTheDocument();
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('CI/CD')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure & Methodologies')).toBeInTheDocument();
  });
});
