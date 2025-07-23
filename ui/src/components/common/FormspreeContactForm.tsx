import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Person, Email, Phone, Message, Send } from "@mui/icons-material";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormspreeContactFormProps {
  formspreeUrl?: string;
  recaptchaSiteKey?: string;
}

const FormspreeContactForm: React.FC<FormspreeContactFormProps> = ({
  formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || "",
  recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
    "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
}) => {
  const theme = useTheme();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear specific field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      // Validate form
      setTimeout(() => validateForm(), 100);
    };

  const onCaptchaVerified = (token: string | null) => {
    setCaptchaVerified(!!token);
  };

  const onCaptchaExpired = () => {
    setCaptchaVerified(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm() || !captchaVerified) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSubmitted(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setCaptchaVerified(false);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(
          errorData.message || `Form submission failed: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.primary.main,
          }}
        >
          Thank You!
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your message has been successfully sent. I will get back to you soon.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            px: 5,
            py: 1.5,
            borderRadius: "4px",
            fontWeight: theme.typography.fontWeightBold,
            fontSize: theme.typography.body1?.fontSize,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.18)",
            "&:hover": {
              background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark || theme.palette.secondary.main} 100%)`,
            },
          }}
          onClick={() => setFormSubmitted(false)}
        >
          Send Another Message
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.primary.main,
          }}
        >
          Get in Touch
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: theme.palette.text.secondary, mb: 2 }}
        >
          I’d love to hear from you! Fill out the form below and I’ll get back
          to you as soon as possible.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: "transparent",
          padding: { xs: 1, sm: 2, md: 3 },
          borderRadius: "4px",
          boxShadow: "none",
        }}
      >
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={!!errors.name}
              helperText={errors.name || "Enter your full name"}
              required
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px", // Explicitly use the same rounding as the rest of the app
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!errors.email}
              helperText={errors.email || "Enter your email address"}
              required
              InputProps={{
                startAdornment: (
                  <Email sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${theme.shape.borderRadius}px`, // Explicitly use the same rounding as the rest of the app
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone (optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              helperText="Enter your phone number"
              InputProps={{
                startAdornment: (
                  <Phone sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${theme.shape.borderRadius}px`, // Explicitly use the same rounding as the rest of the app
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleInputChange("message")}
              error={!!errors.message}
              helperText={errors.message || "Enter your message"}
              required
              InputProps={{
                startAdornment: (
                  <Message
                    sx={{
                      mr: 1,
                      color: "action.active",
                      alignSelf: "flex-start",
                      mt: 1,
                    }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${theme.shape.borderRadius}px`, // Explicitly use the same rounding as the rest of the app
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={onCaptchaVerified}
                onExpired={onCaptchaExpired}
                theme={theme.palette.mode === "dark" ? "dark" : "light"}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || !captchaVerified || isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <Send />
                }
                sx={{
                  minWidth: 220,
                  px: 5,
                  py: 1.7,
                  borderRadius: theme.shape.borderRadius,
                  fontWeight: theme.typography.fontWeightBold,
                  fontSize: theme.typography.body1?.fontSize,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: theme.palette.getContrastText(
                    theme.palette.primary.main,
                  ),
                  boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.18)",
                  "&:hover": {
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                  },
                  "&:disabled": {
                    background: theme.palette.grey[400],
                    color: theme.palette.text.disabled,
                  },
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FormspreeContactForm;
