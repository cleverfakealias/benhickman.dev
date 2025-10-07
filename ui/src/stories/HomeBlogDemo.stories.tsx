import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Box, Paper, Alert } from "@mui/material";
import { createMnTheme } from "../styles/theme";
import BlogCard from "../components/features/blog/BlogCard";
import { BlogPost } from "../components/features/sanity/types";

// Mock blog post data for demonstration
const mockBlogPost: BlogPost = {
  title: "Getting Started with React and TypeScript",
  slug: {
    current: "react-typescript-guide",
  },
  excerpt:
    "Learn how to build modern web applications using React with TypeScript. This comprehensive guide covers everything from setup to advanced patterns.",
  publishedAt: "2024-01-15T10:00:00Z",
  _createdAt: "2024-01-15T09:30:00Z",
  mainImage: {
    asset: {
      _ref: "image-abc123",
      _type: "reference",
    },
    alt: "React and TypeScript logos",
  },
  estimatedReadingTime: 8,
  author: "Ben Hostetler",
  body: [],
};

// Use your actual theme creation function
const lightTheme = createMnTheme("light");
const darkTheme = createMnTheme("dark");

// Theme decorators
const withLightTheme = (Story: any) => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

const withDarkTheme = (Story: any) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

// Component that demonstrates what the Home page looks like with blog posts
const HomeWithBlogDemo = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Alert severity="info" sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Home Page with Blog Post Preview
      </Typography>
      <Typography variant="body2">
        This shows how the Home component appears when blog posts are loaded
        from Sanity CMS. The actual Home component includes the hero banner,
        this blog card, typewriter animation, and summary.
      </Typography>
    </Alert>

    <Paper
      elevation={3}
      sx={{
        p: 4,
        background: (theme) => theme.custom.gradients.hero[theme.palette.mode],
        mb: 4,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        🏠 Home Page Component
      </Typography>
      <Typography variant="body1" align="center">
        Hero Banner • Blog Preview • Interactive Code • Summary
      </Typography>
    </Paper>

    <Box
      sx={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        minHeight: 400,
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BlogCard post={mockBlogPost} />
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 3,
            background: (theme) =>
              theme.custom.gradients.card[theme.palette.mode],
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" align="center">
            🔄 TypewriterCode Animation
            <br />
            Interactive welcome message
          </Typography>
        </Paper>
      </Box>
    </Box>

    <Alert severity="success" sx={{ mt: 4 }}>
      <Typography variant="body2">
        <strong>To see the actual Home component:</strong> Configure Sanity CMS
        with your project ID and dataset, then the Home component will
        automatically load and display your latest blog posts.
      </Typography>
    </Alert>
  </Container>
);

const meta: Meta<typeof HomeWithBlogDemo> = {
  title: "Pages/Home/Blog Demo",
  component: HomeWithBlogDemo,
  decorators: [withLightTheme],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Home Page with Blog Post Preview

This demonstrates how the Home component looks when it successfully loads blog posts from Sanity CMS.

## What you see here:
- **BlogCard component** with real blog post data
- **Layout structure** matching the actual Home component
- **Theme integration** showing proper styling

## In the actual Home component:
- Hero banner with gradient background
- Blog post fetched dynamically from Sanity
- Interactive TypewriterCode animation
- HomeSummary section below

## To get blog posts working:
1. Set up Sanity CMS environment variables
2. Ensure your Sanity project has published blog posts
3. The Home component will automatically fetch and display them

This preview shows you exactly what your users will see when everything is properly configured!
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HomeWithBlogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shows how the Home component looks with a blog post loaded
 */
export const WithBlogPost: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Preview of the Home page layout when a blog post is successfully loaded from Sanity CMS.",
      },
    },
  },
};

/**
 * Dark theme version with blog post
 */
export const DarkThemeWithBlogPost: Story = {
  decorators: [withDarkTheme],
  parameters: {
    docs: {
      description: {
        story:
          "Dark theme version showing how the blog post card adapts to the dark theme styling.",
      },
    },
  },
};
