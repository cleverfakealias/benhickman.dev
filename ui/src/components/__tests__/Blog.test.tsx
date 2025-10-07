import '@testing-library/jest-dom';
// Mock fetchPosts from the correct path used in Blog.tsx
jest.mock('../features/sanity/sanityClient', () => ({
  fetchPosts: jest.fn(() => Promise.resolve([])),
}));
import { render, waitFor, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import Blog from '../../pages/Blog';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={createMnTheme('light')}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('Blog', () => {
  test('renders without crashing', async () => {
    await act(async () => {
      renderWithProviders(<Blog />);
    });
    // Blog component should render some content
    expect(document.body).toBeInTheDocument();
  });

  test('renders blog heading or loading state', async () => {
    await act(async () => {
      renderWithProviders(<Blog />);
    });
    // Wait for the blog content to load (mock returns empty array)
    await waitFor(() => {
      expect(screen.getByText('No blog posts yet')).toBeInTheDocument();
    });
  });
});
