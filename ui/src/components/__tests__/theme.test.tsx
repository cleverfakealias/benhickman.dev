import '@testing-library/jest-dom';
import { createMnTheme } from '../../styles/theme';

describe('Theme', () => {
  test('creates light theme correctly', () => {
    const lightTheme = createMnTheme('light');

    expect(lightTheme.palette.mode).toBe('light');
    expect(lightTheme.palette.primary.main).toBeDefined();
  });

  test('creates dark theme correctly', () => {
    const darkTheme = createMnTheme('dark');

    expect(darkTheme.palette.mode).toBe('dark');
    expect(darkTheme.palette.primary.main).toBeDefined();
  });

  test('themes have correct primary colors', () => {
    const lightTheme = createMnTheme('light');
    const darkTheme = createMnTheme('dark');

    // Light theme should have ABE purple as primary color
    expect(lightTheme.palette.primary.main).toBe('#412A91');
    // Dark theme should have loon gray as primary color
    expect(darkTheme.palette.primary.main).toBe('#8CD2EF');
  });

  test('themes have different background colors', () => {
    const lightTheme = createMnTheme('light');
    const darkTheme = createMnTheme('dark');

    // Background colors should be different
    expect(lightTheme.palette.background.default).not.toBe(darkTheme.palette.background.default);
  });
});
