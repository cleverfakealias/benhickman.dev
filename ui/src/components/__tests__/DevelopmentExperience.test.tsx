import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import DevelopmentExperience from '../../pages/DevelopmentExperience';

// Mock CareerTimeline to avoid heavy rendering and potential open handles
jest.mock('../../components/features/CareerTimeline', () => {
  const React = require('react');
  const MockTimeline = ({ title }: { title?: string }) => (
    <div data-testid="career-timeline">{title ?? 'Timeline'}</div>
  );
  return { __esModule: true, default: MockTimeline };
});

const theme = createMnTheme('light');

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <DevelopmentExperience />
    </ThemeProvider>
  );

describe('DevelopmentExperience', () => {
  test('renders core content and structure (single render)', () => {
    renderPage();

    // Title and subtitle
    expect(
      screen.getByRole('heading', { level: 1, name: /development experience/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Technical expertise spanning full-stack development, modern frameworks, and enterprise solutions/i
      )
    ).toBeInTheDocument();

    // Section headings (h2)
    const sections = [
      'Full Stack Development',
      'Front-End Technologies',
      'Back-End Technologies',
      'Databases',
      'CI/CD',
      'Infrastructure & Methodologies',
    ];
    sections.forEach((name) => {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    });

    // Representative description snippets
    expect(screen.getByText(/over 7 years of professional experience/i)).toBeInTheDocument();
    expect(screen.getByText(/responsive user interfaces/i)).toBeInTheDocument();
    expect(screen.getByText(/back-end development with Java and Python/i)).toBeInTheDocument();
    expect(screen.getByText(/variety of database systems/i)).toBeInTheDocument();
    expect(screen.getByText(/modern DevOps pipelines/i)).toBeInTheDocument();
    expect(screen.getByText(/Docker and Kubernetes/i)).toBeInTheDocument();

    // Timeline mocked presence
    expect(screen.getByTestId('career-timeline')).toBeInTheDocument();
  });
});
