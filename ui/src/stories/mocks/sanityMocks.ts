import { BlogPost } from "../../components/features/sanity/types";

// Mock blog post data for Storybook
export const mockBlogPosts: BlogPost[] = [
  {
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
  },
  {
    title: "Advanced TypeScript Patterns for React",
    slug: {
      current: "advanced-typescript-react",
    },
    excerpt:
      "Dive deep into advanced TypeScript patterns that will make your React applications more robust and maintainable. Explore utility types, conditional types, and more.",
    publishedAt: "2024-02-20T14:30:00Z",
    _createdAt: "2024-02-20T14:00:00Z",
    mainImage: {
      asset: {
        _ref: "image-def456",
        _type: "reference",
      },
      alt: "Advanced TypeScript concepts",
    },
    estimatedReadingTime: 12,
    author: "Ben Hostetler",
    body: [],
  },
  {
    title: "Building Scalable UI Components with Material-UI",
    slug: {
      current: "scalable-mui-components",
    },
    excerpt:
      "Master the art of creating reusable, themeable UI components with Material-UI. Learn best practices for component composition and theming.",
    publishedAt: "2024-03-10T16:45:00Z",
    _createdAt: "2024-03-10T16:15:00Z",
    mainImage: {
      asset: {
        _ref: "image-ghi789",
        _type: "reference",
      },
      alt: "Material-UI component library",
    },
    estimatedReadingTime: 10,
    author: "Ben Hostetler",
    body: [],
  },
];

// Mock function that returns the mock data
export const mockFetchPosts = () => Promise.resolve(mockBlogPosts);

// Mock function for empty state
export const mockFetchPostsEmpty = () => Promise.resolve([]);

// Mock function for single post
export const mockFetchSinglePost = () => Promise.resolve([mockBlogPosts[0]]);
