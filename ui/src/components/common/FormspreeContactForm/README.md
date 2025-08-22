# FormspreeContactForm Component

A modular, accessible contact form component that integrates with Formspree and reCAPTCHA.

## Structure

```
FormspreeContactForm/
├── index.tsx                 # Main component entry point
├── types.ts                  # TypeScript type definitions
├── validation.ts            # Form validation utilities
├── api.ts                   # API submission logic
├── useFormspreeForm.ts      # Custom hook for form state management
├── ContactForm.tsx          # Main form component
├── FormField.tsx            # Reusable form field component
├── FormHeader.tsx           # Form header/title component
├── SuccessScreen.tsx        # Success confirmation screen
├── SubmitButton.tsx         # Form submit button
├── exports.ts               # All exports for external use
└── README.md                # This documentation
```

## Usage

### Basic Usage
```tsx
import FormspreeContactForm from './components/common/FormspreeContactForm';

// Use in your component
<FormspreeContactForm />
```

### Advanced Usage with Individual Components
```tsx
import { 
  ContactForm, 
  FormField, 
  useFormspreeForm 
} from './components/common/FormspreeContactForm/exports';

// Custom implementation using the hook and components
const MyCustomForm = () => {
  const formState = useFormspreeForm(formspreeUrl, recaptchaSiteKey);
  
  return (
    <ContactForm {...formState} />
  );
};
```

## Components

### FormspreeContactForm (Main Component)
The primary component that handles the complete contact form flow including success states.

### useFormspreeForm (Custom Hook)
Manages all form state, validation, and submission logic. Returns:
- Form data and validation state
- Handlers for input changes and form submission
- CAPTCHA management
- Error handling

### ContactForm
The main form UI component that renders all form fields and handles user interactions.

### FormField
A reusable form field component with consistent styling and validation display.

### SuccessScreen
Displays the success message after form submission.

### SubmitButton
The form submission button with loading states and proper accessibility.

### FormHeader
The form title and description section.

## Utilities

### validation.ts
- `validateEmail()`: Email format validation
- `validateForm()`: Complete form validation
- `isFormValid()`: Check if form has any errors

### api.ts
- `submitForm()`: Handles the Formspree API submission with proper error handling

## Types

All TypeScript interfaces and types are defined in `types.ts`:
- `FormData`: Form field data structure
- `FormErrors`: Validation error structure
- `FormspreeContactFormProps`: Main component props
- `FormState`: Complete form state interface

## Configuration

The component automatically gets configuration from `getDomainConfig()`:
- `formspreeUrl`: Your Formspree form endpoint
- `recaptchaSiteKey`: Your reCAPTCHA site key

## Features

- ✅ **Modular Architecture**: Each piece has a single responsibility
- ✅ **TypeScript Support**: Full type safety throughout
- ✅ **Custom Hook**: Reusable form logic
- ✅ **Validation**: Real-time form validation with user feedback
- ✅ **Accessibility**: ARIA labels, proper form semantics
- ✅ **Theme Integration**: Uses Material-UI theme system
- ✅ **Error Handling**: Comprehensive error states and user feedback
- ✅ **CAPTCHA Integration**: reCAPTCHA v2 support
- ✅ **Loading States**: Visual feedback during submission
- ✅ **Responsive Design**: Works on all screen sizes

## Benefits of Refactoring

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Individual components can be used elsewhere
3. **Testability**: Each piece can be unit tested independently
4. **Readability**: Smaller, focused files are easier to understand
5. **Extensibility**: Easy to add new features or modify existing ones
6. **Performance**: Better tree-shaking and code splitting opportunities
