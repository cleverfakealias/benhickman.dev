import React from 'react';
import { Button, CircularProgress, useTheme } from '@mui/material';
import { Send } from '@mui/icons-material';

interface SubmitButtonProps {
  isFormValid: boolean;
  captchaVerified: boolean;
  isSubmitting: boolean;
  configError: string | null;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isFormValid,
  captchaVerified,
  isSubmitting,
  configError,
}) => {
  const theme = useTheme();

  return (
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
        boxShadow: theme.custom.shadows.button.dark,
        '&:hover': {
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
        },
        '&:disabled': {
          background: theme.palette.grey[400],
          color: theme.palette.text.disabled,
        },
      }}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  );
};

export default SubmitButton;
