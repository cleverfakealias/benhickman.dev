import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "../pages/Home";
import { createMnTheme } from "../styles/theme";

// Use your actual theme creation function
const lightTheme = createMnTheme('light');
const darkTheme = createMnTheme('dark');

// Decorator to provide theme context
const withMuiTheme = (Story: any) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};

// Decorator for dark theme
const withDarkTheme = (Story: any) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};

const meta: Meta<typeof Home> = {
  title: "Pages/Home",
  component: Home,
  decorators: [withMuiTheme],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "The main home page component featuring a hero banner, blog preview, interactive code typewriter, and summary section.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - no blog posts (current behavior)
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "The default home page state when no blog posts are available or API calls fail. Shows the layout structure without blog content.",
      },
    },
  },
};

// Dark theme variant
export const DarkTheme: Story = {
  decorators: [withDarkTheme],
  parameters: {
    docs: {
      description: {
        story: "Home page with dark theme applied, showing layout without blog posts.",
      },
    },
  },
};

// Component layout showcase
export const ComponentLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: "Showcases the layout and structure of the home page components including hero banner, blog card area, typewriter code, and summary section.",
      },
    },
  },
};
