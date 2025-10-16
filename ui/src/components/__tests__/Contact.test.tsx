import '@testing-library/jest-dom';

// Mock the FormspreeContactForm to avoid ReCAPTCHA and env issues in tests
jest.mock('../common/FormspreeContactForm', () => {
  const React = require('react');
  const MockFormspreeContactForm = () => (
    <div data-testid="formspree-contact-form">
      <h1>Please feel free to reach out to me and I'll get back to you as soon as possible!</h1>
      <form>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <input name="phone" placeholder="Phone (optional)" />
        <textarea name="message" placeholder="Message" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
  return {
    __esModule: true,
    default: MockFormspreeContactForm,
    FormspreeContactForm: MockFormspreeContactForm,
  };
});

// Mock the ContactInformation component
jest.mock('../common/ContactInformation', () => {
  const React = require('react');
  const MockContactInformation = () => (
    <div data-testid="contact-information">
      <h3>Contact Information</h3>
      <div>Email: me@benhickman.dev</div>
      <div>Phone: (651) 300-4252</div>
      <div>Location: Minnesota, USA</div>
    </div>
  );
  return {
    __esModule: true,
    default: MockContactInformation,
    ContactInformation: MockContactInformation,
  };
});

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createMnTheme } from '../../styles/theme';
import Contact from '../../pages/Contact';

const theme = createMnTheme('light');

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Contact', () => {
  test('renders FormspreeContactForm component', () => {
    renderWithTheme(<Contact />);
    expect(screen.getByTestId('formspree-contact-form')).toBeInTheDocument();
  });

  test('renders ContactInformation component', () => {
    renderWithTheme(<Contact />);
    expect(screen.getByTestId('contact-information')).toBeInTheDocument();
  });

  test('renders contact form header text', () => {
    renderWithTheme(<Contact />);
    expect(
      screen.getByText(
        "Please feel free to reach out to me and I'll get back to you as soon as possible!"
      )
    ).toBeInTheDocument();
  });

  test('renders contact information section', () => {
    renderWithTheme(<Contact />);
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  test('renders form fields', () => {
    renderWithTheme(<Contact />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
  });

  test('renders submit button', () => {
    renderWithTheme(<Contact />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('renders contact details in ContactInformation', () => {
    renderWithTheme(<Contact />);
    expect(screen.getByText('Email: me@benhickman.dev')).toBeInTheDocument();
    expect(screen.getByText('Phone: (651) 300-4252')).toBeInTheDocument();
    expect(screen.getByText('Location: Minnesota, USA')).toBeInTheDocument();
  });
});
