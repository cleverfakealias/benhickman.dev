import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FormData, FormErrors } from './types';
import { validateForm, isFormValid } from './validation';
import { submitForm } from './api';

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export const useFormspreeForm = (
  formspreeUrl?: string,
  hCaptchaSiteKey?: string,
  defaultSubject?: string
) => {
  const captchaRef = useRef<HCaptcha>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formValid, setFormValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const configError = !formspreeUrl
    ? 'Missing Formspree URL in configuration.'
    : !hCaptchaSiteKey
      ? 'Missing hCaptcha site key in configuration.'
      : null;

  const onCaptchaVerified = (token: string | null) => {
    setCaptchaToken(token);
    setCaptchaVerified(!!token);
  };

  const onCaptchaExpired = () => {
    setCaptchaToken(null);
    setCaptchaVerified(false);
  };

  const resetCaptcha = () => {
    if (captchaRef.current) captchaRef.current.resetCaptcha();
    setCaptchaVerified(false);
    setCaptchaToken(null);
  };

  const validateFormData = (): boolean => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    const valid = isFormValid(newErrors);
    setFormValid(valid);
    return valid;
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field-specific error as user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Debounced-ish validation
      setTimeout(() => validateFormData(), 80);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (configError) {
      setSubmitError(configError);
      return;
    }

    // Client-side validation + captcha token guard
    const formOk = validateFormData();
    if (!formOk) return;

    if (!captchaVerified || !captchaToken) {
      setSubmitError('Please complete the CAPTCHA before submitting.');
      return;
    }

    if (isSubmitting) return; // double-click guard
    setIsSubmitting(true);

    try {
      const result = await submitForm({
        formData,
        captchaToken,
        formspreeUrl: formspreeUrl!,
        subject: defaultSubject,
      });

      if (result.success) {
        setFormSubmitted(true);
        setFormData(initialFormData);
        resetCaptcha();
      } else {
        // If the error likely relates to captcha, reset it so user can retry with a fresh token
        if (result.error && /captcha|recaptcha|token/i.test(result.error)) {
          resetCaptcha();
        }
        setSubmitError(result.error || 'An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setFormData(initialFormData);
    setErrors({});
    setFormValid(false);
    setSubmitError(null);
    resetCaptcha();
  };

  return {
    // Form state
    formData,
    errors,
    formValid,
    formSubmitted,
    captchaVerified,
    captchaToken,
    isSubmitting,
    submitError,
    configError,

    // Refs
    captchaRef,

    // Handlers
    handleInputChange,
    handleSubmit,
    onCaptchaVerified,
    onCaptchaExpired,
    resetForm,
  };
};
