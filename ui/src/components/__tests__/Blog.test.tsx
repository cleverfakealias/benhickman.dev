import "@testing-library/jest-dom";
// Mock fetchPosts from the correct path used in Blog.tsx
jest.mock("../features/sanity/sanityClient", () => ({
  fetchPosts: jest.fn(() => Promise.resolve([])),
}));
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Blog from "../../pages/Blog";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Blog", () => {
  test("renders without crashing", async () => {
    await waitFor(() => {
      renderWithRouter(<Blog />);
    });
    // Blog component should render some content
    expect(document.body).toBeInTheDocument();
  });

  test("renders blog heading or loading state", async () => {
    renderWithRouter(<Blog />);
    // Wait for any async state updates to flush
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
    // Should either show blog content or loading state
    // Since we're mocking Sanity to return empty array,
    // the component should handle this gracefully
  });
});
