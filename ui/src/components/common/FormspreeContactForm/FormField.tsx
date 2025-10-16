import React from 'react';
import { TextField, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
  startIcon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  required = false,
  type = 'text',
  multiline = false,
  rows,
  startIcon,
}) => {
  const theme = useTheme();

  const inputProps = startIcon
    ? {
        startAdornment: multiline
          ? React.cloneElement(startIcon as React.ReactElement, {
              sx: {
                mr: 1,
                color: 'action.active',
                alignSelf: 'flex-start',
                mt: 1,
              },
            })
          : React.cloneElement(startIcon as React.ReactElement, {
              sx: { mr: 1, color: 'action.active' },
            }),
      }
    : undefined;

  return (
    <Grid2 size={{ xs: 12 }}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error || helperText}
        required={required}
        multiline={multiline}
        rows={rows}
        InputProps={inputProps}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: `${theme.shape.borderRadius}px`,
            background: theme.palette.background.paper,
            boxShadow: theme.palette.mode === 'dark' ? theme.shadows[6] : theme.shadows[2],
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
            },
          },
        }}
      />
    </Grid2>
  );
};

export default FormField;
