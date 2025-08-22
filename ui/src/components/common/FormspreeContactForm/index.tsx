import React from "react";
import { Box } from "@mui/material";
import { getDomainConfig } from "../../../config/domainConfig";
import { FormspreeContactFormProps } from "./types";
import { useFormspreeForm } from "./useFormspreeForm";
import FormHeader from "./FormHeader";
import ContactForm from "./ContactForm";
import SuccessScreen from "./SuccessScreen";

const FormspreeContactForm: React.FC<FormspreeContactFormProps> = () => {
  const { formspreeUrl, recaptchaSiteKey } = getDomainConfig();

  const {
    // Form state
    formData,
    errors,
    formValid,
    formSubmitted,
    captchaVerified,
    isSubmitting,
    submitError,
    configError,
    
    // Refs
    recaptchaRef,
    
    // Handlers
    handleInputChange,
    handleSubmit,
    onCaptchaVerified,
    onCaptchaExpired,
    resetForm,
  } = useFormspreeForm(formspreeUrl, recaptchaSiteKey);

  if (formSubmitted) {
    return <SuccessScreen onSendAnother={resetForm} />;
  }

  return (
    <Box sx={{ py: 2 }}>
      <FormHeader />
      <ContactForm
        formData={formData}
        errors={errors}
        formValid={formValid}
        captchaVerified={captchaVerified}
        isSubmitting={isSubmitting}
        submitError={submitError}
        configError={configError}
        recaptchaSiteKey={recaptchaSiteKey!}
        recaptchaRef={recaptchaRef}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCaptchaVerified={onCaptchaVerified}
        onCaptchaExpired={onCaptchaExpired}
      />
    </Box>
  );
};

export default FormspreeContactForm;
