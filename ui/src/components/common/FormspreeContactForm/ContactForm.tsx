import React from "react";
import {
  Box,
  Alert,
  useTheme,
} from "@mui/material";
import { Person, Email, Phone, Message } from "@mui/icons-material";
import Grid2 from "@mui/material/Grid2";
import ReCAPTCHA from "react-google-recaptcha";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";
import { FormData } from "./types";

interface ContactFormProps {
  formData: FormData;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  formValid: boolean;
  captchaVerified: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  configError: string | null;
  recaptchaSiteKey: string;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onInputChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCaptchaVerified: (token: string | null) => void;
  onCaptchaExpired: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  errors,
  formValid,
  captchaVerified,
  isSubmitting,
  submitError,
  configError,
  recaptchaSiteKey,
  recaptchaRef,
  onInputChange,
  onSubmit,
  onCaptchaVerified,
  onCaptchaExpired,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      aria-busy={isSubmitting ? "true" : "false"}
      sx={{
        backgroundColor: "transparent",
        padding: { xs: 1, sm: 2, md: 3 },
        borderRadius: "4px",
        boxShadow: "none",
      }}
    >
      {(submitError || configError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError || configError}
        </Alert>
      )}

      <Grid2 container spacing={3}>
        <FormField
          label="Name"
          name="name"
          value={formData.name}
          onChange={onInputChange("name")}
          error={errors.name}
          helperText="Enter your full name"
          required
          startIcon={<Person />}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange("email")}
          error={errors.email}
          helperText="Enter your email address"
          required
          startIcon={<Email />}
        />

        <FormField
          label="Phone (optional)"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onInputChange("phone")}
          helperText="Enter your phone number"
          startIcon={<Phone />}
        />

        <FormField
          label="Message"
          name="message"
          value={formData.message}
          onChange={onInputChange("message")}
          error={errors.message}
          helperText="Enter your message"
          required
          multiline
          rows={4}
          startIcon={<Message />}
        />

        <Grid2 size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              onChange={onCaptchaVerified}
              onExpired={onCaptchaExpired}
              theme={theme.palette.mode === "dark" ? "dark" : "light"}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <SubmitButton
              isFormValid={formValid}
              captchaVerified={captchaVerified}
              isSubmitting={isSubmitting}
              configError={configError}
            />
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ContactForm;
