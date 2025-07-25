import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createMnTheme } from "../../styles/theme";
import About from "../../pages/About";

const theme = createMnTheme("light");

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("About", () => {
  test("renders about page title", () => {
    renderWithTheme(<About />);
    expect(screen.getByText("About Me")).toBeInTheDocument();
  });

  test("renders about page subtitle", () => {
    renderWithTheme(<About />);
    expect(
      screen.getByText(
        "Passionate software engineer dedicated to building impactful solutions",
      ),
    ).toBeInTheDocument();
  });

  test("renders introduction text", () => {
    renderWithTheme(<About />);
    expect(
      screen.getByText(
        "Hello, I’m Ben — the developer behind Zengineer Cloud Development.",
      ),
    ).toBeInTheDocument();
  });

  test("renders What I Bring section", () => {
    renderWithTheme(<About />);
    expect(screen.getByText("What I Bring")).toBeInTheDocument();
  });

  test("renders Technical Skills section", () => {
    renderWithTheme(<About />);
    expect(screen.getByText("Technical Skills")).toBeInTheDocument();
  });

  test("renders highlight cards", () => {
    renderWithTheme(<About />);
    expect(screen.getByText("Enterprise SaaS Experience")).toBeInTheDocument();
    expect(screen.getByText("System Architecture")).toBeInTheDocument();
    expect(screen.getByText("Cloud-Native Development")).toBeInTheDocument();
    expect(screen.getByText("Full-Stack Development")).toBeInTheDocument();
  });

  test("renders skill chips", () => {
    renderWithTheme(<About />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  test("has proper heading structure", () => {
    renderWithTheme(<About />);

    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toHaveTextContent("About Me");

    const subHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(subHeadings).toHaveLength(2); // What I Bring and Technical Skills
  });
});
