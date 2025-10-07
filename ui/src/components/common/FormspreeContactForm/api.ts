import { FormData } from './types';

interface FormspreeError {
  message: string;
}

export interface SubmitFormOptions {
  formData: FormData;
  captchaToken: string;
  formspreeUrl: string;
}

export const submitForm = async ({
  formData,
  captchaToken,
  formspreeUrl,
}: SubmitFormOptions): Promise<{ success: boolean; error?: string }> => {
  // Build urlencoded body (Formspree-friendly) and include the reCAPTCHA token
  const params = new URLSearchParams();
  Object.entries(formData).forEach(([k, v]) => params.append(k, String(v)));
  params.append('g-recaptcha-response', captchaToken);

  // Add a timeout so the UI isn't stuck if the network hangs
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s cap

  try {
    const response = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
      // CORS-safe defaults; Formspree doesn't need cookies
      credentials: 'omit',
      signal: controller.signal,
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    });

    // Handle success / error robustly (Formspree often returns JSON, but be defensive)
    if (response.ok) {
      return { success: true };
    }

    // Try to parse JSON error, else fall back to text/status
    let errMsg = `Form submission failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) errMsg = errorData.message;
      // Formspree sometimes returns field errors:
      if (Array.isArray(errorData?.errors) && errorData.errors.length) {
        errMsg = errorData.errors.map((e: FormspreeError) => e.message).join('; ');
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errMsg = text;
      } catch {
        /* ignore */
      }
    }

    return { success: false, error: errMsg };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        error: 'The request timed out. Please check your connection and try again.',
      };
    } else {
      console.error('Form submission error:', err);
      return {
        success: false,
        error: 'A network error occurred. Please try again.',
      };
    }
  } finally {
    clearTimeout(timeoutId);
  }
};
