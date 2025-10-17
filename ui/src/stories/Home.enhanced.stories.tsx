import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from '../pages/Home';
import { buildTheme } from '../theme/theme';

// Use your actual theme creation function
const lightTheme = buildTheme('light');
const darkTheme = buildTheme('dark');

// Theme decorators
const withLightTheme = (Story: React.ComponentType) => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

const withDarkTheme = (Story: React.ComponentType) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

const meta: Meta<typeof Home> = {
  title: 'Pages/Home/Enhanced',
  component: Home,
  decorators: [withLightTheme],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Home Page Component - Enhanced Stories

The main landing page of the application featuring:
- **Hero Banner**: Eye-catching introduction section
- **Blog Preview**: Shows the latest blog post in a card format
- **Interactive Typewriter**: Animated code snippet with welcome message
- **Summary Section**: Overview of the site content and purpose

The component fetches the latest blog post from Sanity CMS and displays it alongside
an interactive code demonstration. The layout is responsive and works well on all devices.

This enhanced story collection includes additional variations for different viewports,
themes, and accessibility testing scenarios.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the home page.
 * Note: Blog posts are fetched from Sanity CMS via API calls.
 * In Storybook, these calls may fail due to missing environment variables,
 * resulting in an empty blog card area.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
The standard home page view. In production, this would show:
- A featured blog post in the left panel (when API is configured)
- Interactive typewriter code animation on the right
- Hero banner and summary sections

**Note**: Blog posts require Sanity CMS configuration with:
- \`VITE_SANITY_PROJECT_ID\`
- \`VITE_SANITY_DATASET\`

Without these environment variables, the blog card area will be empty.
        `,
      },
    },
  },
};

/**
 * Home page with the dark theme applied.
 * Shows how the component adapts to different theme modes.
 */
export const DarkTheme: Story = {
  decorators: [withDarkTheme],
  parameters: {
    docs: {
      description: {
        story: `
Home page rendered with dark theme, demonstrating:
- Dark theme gradient backgrounds
- Light text on dark surfaces  
- Theme-aware component styling
- Consistent visual hierarchy

The blog post area behavior is the same as the default story.
        `,
      },
    },
  },
};

/**
 * Shows the home page layout and component structure.
 * Useful for understanding the visual hierarchy and spacing.
 */
export const LayoutShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Focuses on the layout structure showing:

**Hero Banner**: 
- Custom gradient background
- Centered content with responsive design
- Accent bar decoration

**Two-Column Content Area**:
- Left: Blog card area (320px min-width)
- Right: Typewriter code animation (320px min-width)  
- Responsive stacking on mobile
- 32px gap between columns

**Summary Section**:
- Overview content below the main content
- Full-width layout
        `,
      },
    },
  },
};

/**
 * Mobile responsive view of the home page.
 * Demonstrates how the layout adapts to smaller screens.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: `
Mobile-optimized view showing:
- Vertical stacking of the two-column layout
- Responsive typography scaling
- Touch-friendly spacing
- Maintained visual hierarchy

The content automatically reflows for optimal mobile viewing experience.
        `,
      },
    },
  },
};

/**
 * Tablet view of the home page.
 * Shows the intermediate responsive breakpoint.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: `
Tablet view demonstrating:
- Intermediate responsive behavior at medium screen sizes
- Balanced column layout
- Optimized for touch interaction
- Proper content spacing
        `,
      },
    },
  },
};

/**
 * Documentation about blog post functionality
 */
export const BlogPostIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Blog Post Integration

The Home component integrates with Sanity CMS to display featured blog posts:

### How it works:
1. **API Call**: \`fetchPosts()\` is called in \`useEffect\`
2. **Data Processing**: Posts are sorted by \`publishedAt\` or \`_createdAt\`
3. **Display**: Most recent post is shown in \`BlogCard\` component
4. **Fallback**: Empty state when no posts are available

### BlogCard Features:
- Post title and excerpt
- Author information  
- Estimated reading time
- Publication date
- Main image (when available)
- Click-through to full article

### Required Environment Variables:
\`\`\`bash
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
\`\`\`

### Data Structure:
\`\`\`typescript
interface BlogPost {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { asset: { _ref: string } };
  estimatedReadingTime?: number;
  author?: string;
}
\`\`\`
        `,
      },
    },
  },
};
