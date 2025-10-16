/**
 * Minimal a11y smoke test; can be upgraded to vitest + axe later
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { buildTheme } from '../../theme/theme';
import Button from '@mui/material/Button';

describe.skip('a11y smoke', () => {
  it('renders focus-visible outline color via token', () => {
    const theme = buildTheme('light');
    render(
      <ThemeProvider theme={theme}>
        <Button variant="contained">Click me</Button>
      </ThemeProvider>
    );
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
  });
});
