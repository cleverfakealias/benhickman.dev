import React, { useState, useRef } from "react";
import { getDomainConfig } from "../../config/domainConfig";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Person, Email, Phone, Message, Send } from "@mui/icons-material";
import Grid2 from "@mui/material/Grid2";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormspreeContactFormProps {
  formspreeUrl?: string;
  hCaptchaSiteKey?: string;
}

const FormspreeContactForm: React.FC<FormspreeContactFormProps> = () => {
  const { formspreeUrl, hCaptchaSiteKey } = getDomainConfig();
  const theme = useTheme();
  const captchaRef = useRef<HCaptcha>(null);

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Early guard if config is missing
  const configError =
    !formspreeUrl
      ? "Missing Formspree URL in configuration."
      : !hCaptchaSiteKey
        ? "Missing hCaptcha site key in configuration."
        : null;

  const onCaptchaVerified = (token: string) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
  };
  const onCaptchaExpired = () => {
    setCaptchaToken(null);
    setCaptchaVerified(false);
  };

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange =
    (field: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear field-specific error as user types
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        // Debounced-ish validation
        setTimeout(() => validateForm(), 80);
      };

  const resetCaptcha = () => {
    if (captchaRef.current) captchaRef.current.resetCaptcha();
    setCaptchaVerified(false);
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (configError) {
      setSubmitError(configError);
      return;
    }

    // 1) Client-side validation + captcha token guard
    const formOk = validateForm();
    if (!formOk) return;

    if (!captchaVerified || !captchaToken) {
      setSubmitError("Please complete the CAPTCHA before submitting.");
      return;
    }

    if (isSubmitting) return; // double-click guard
    setIsSubmitting(true);

    // 2) Build urlencoded body (Formspree-friendly) and include the hCaptcha token
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([k, v]) => params.append(k, String(v)));
    params.append("h-captcha-response", captchaToken);

    // 3) Add a timeout so the UI isn't stuck if the network hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s cap

    try {
      const response = await fetch(formspreeUrl!, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
        // CORS-safe defaults; Formspree doesn’t need cookies
        credentials: "omit",
        signal: controller.signal,
        cache: "no-store",
        referrerPolicy: "no-referrer",
      });

      // 4) Handle success / error robustly (Formspree often returns JSON, but be defensive)
      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        resetCaptcha();
        return;
      }

      // Try to parse JSON error, else fall back to text/status
      let errMsg = `Form submission failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) errMsg = errorData.message;
        // Formspree sometimes returns field errors:
        if (Array.isArray(errorData?.errors) && errorData.errors.length) {
          errMsg = errorData.errors.map((e: any) => e.message).join("; ");
        }
      } catch {
        try {
          const text = await response.text();
          if (text) errMsg = text;
        } catch {
          /* ignore */
        }
      }

      // If the error likely relates to captcha, reset it so user can retry with a fresh token
      if (/captcha|hcaptcha|token/i.test(errMsg)) resetCaptcha();

      setSubmitError(errMsg);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setSubmitError(
          "The request timed out. Please check your connection and try again."
        );
      } else {
        console.error("Form submission error:", err);
        setSubmitError("A network error occurred. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
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
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          I’d love to hear from you! Fill out the form below and I’ll get back
          to you as soon as possible.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
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
          <Grid2 size={{ xs: 12 }}>
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
                startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
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
                startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${theme.shape.borderRadius}px`,
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Phone (optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              helperText="Enter your phone number"
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${theme.shape.borderRadius}px`,
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
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
                  borderRadius: `${theme.shape.borderRadius}px`,
                  background: theme.palette.background.paper,
                  boxShadow: "0 1px 4px 0 rgba(31,38,135,0.07)",
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <HCaptcha
                ref={captchaRef}
                sitekey={hCaptchaSiteKey!}
                onVerify={onCaptchaVerified}
                onExpire={onCaptchaExpired}
                theme={theme.palette.mode === "dark" ? "dark" : "light"}
              />
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || !captchaVerified || isSubmitting || !!configError}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                sx={{
                  minWidth: 220,
                  px: 5,
                  py: 1.7,
                  borderRadius: theme.shape.borderRadius,
                  fontWeight: theme.typography.fontWeightBold,
                  fontSize: theme.typography.body1?.fontSize,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: theme.palette.getContrastText(theme.palette.primary.main),
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
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default FormspreeContactForm;
