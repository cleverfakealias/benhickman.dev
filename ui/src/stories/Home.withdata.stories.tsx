import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomeWrapper from "./HomeWrapper";
import { createMnTheme } from "../styles/theme";
import { mockBlogPosts } from "./mocks/sanityMocks";

// Use your actual theme creation function
const lightTheme = createMnTheme('light');
const darkTheme = createMnTheme('dark');

// Decorator to provide theme context
const withLightTheme = (Story: any) => {
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

const meta: Meta<typeof HomeWrapper> = {
  title: "Pages/Home/With Data",
  component: HomeWrapper,
  decorators: [withLightTheme],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Home Page Component - With Mock Data

Enhanced version of the Home page component that can display mock blog posts for Storybook.
This allows you to see how the component looks with actual content loaded.

**Features shown:**
- Hero banner with custom theming
- Blog post card with featured article
- Interactive typewriter code animation  
- Summary section

**Data States:**
- With blog posts (shows featured post)
- Without blog posts (empty state)
- Multiple posts (shows most recent)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showMockData: {
      control: "boolean",
      description: "Whether to use mock data instead of real API calls"
    },
    mockPosts: {
      control: "object",
      description: "Array of mock blog posts to display"
    }
  },
} satisfies Meta<typeof HomeWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Home page with no blog posts - shows the empty state
 */
export const EmptyState: Story = {
  args: {
    showMockData: true,
    mockPosts: []
  },
  parameters: {
    docs: {
      description: {
        story: "Home page when no blog posts are available. Shows the layout structure with an empty blog card area.",
      },
    },
  },
};

/**
 * Home page with a single featured blog post
 */
export const WithFeaturedPost: Story = {
  args: {
    showMockData: true,
    mockPosts: [mockBlogPosts[0]]
  },
  parameters: {
    docs: {
      description: {
        story: "Home page displaying a featured blog post in the blog card section. This is the typical user experience.",
      },
    },
  },
};

/**
 * Home page with multiple blog posts (shows most recent)
 */
export const WithMultiplePosts: Story = {
  args: {
    showMockData: true,
    mockPosts: mockBlogPosts
  },
  parameters: {
    docs: {
      description: {
        story: "Home page with multiple blog posts available. The component automatically displays the most recently published post.",
      },
    },
  },
};

/**
 * Dark theme with featured post
 */
export const DarkThemeWithPost: Story = {
  decorators: [withDarkTheme],
  args: {
    showMockData: true,
    mockPosts: [mockBlogPosts[0]]
  },
  parameters: {
    docs: {
      description: {
        story: "Home page with dark theme and a featured blog post, showing the full theming capabilities.",
      },
    },
  },
};

/**
 * Production-like behavior (will likely show empty state in Storybook)
 */
export const ProductionBehavior: Story = {
  args: {
    showMockData: false,
    mockPosts: []
  },
  parameters: {
    docs: {
      description: {
        story: "Home page using real API calls (will likely show empty state in Storybook due to missing Sanity configuration).",
      },
    },
  },
};
