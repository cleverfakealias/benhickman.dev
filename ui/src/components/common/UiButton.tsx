import Button, { ButtonProps } from '@mui/material/Button';

export type UiButtonProps = ButtonProps & {
  loading?: boolean;
};

export function UiButton({ loading, children, disabled, ...props }: UiButtonProps) {
  return (
    <Button
      data-state={loading ? 'loading' : undefined}
      disabled={disabled || loading}
      {...props}
      sx={{
        position: 'relative',
        '&[data-state="loading"]': {
          pointerEvents: 'none',
          opacity: 0.7,
        },
      }}
    >
      {children}
    </Button>
  );
}

export default UiButton;
