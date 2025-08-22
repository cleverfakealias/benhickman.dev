export interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FormspreeContactFormProps {
  formspreeUrl?: string;
  recaptchaSiteKey?: string;
}

export interface FormErrors extends Partial<FormData> {}

export interface FormState {
  formData: FormData;
  errors: FormErrors;
  isFormValid: boolean;
  formSubmitted: boolean;
  captchaVerified: boolean;
  captchaToken: string | null;
  isSubmitting: boolean;
  submitError: string | null;
}
