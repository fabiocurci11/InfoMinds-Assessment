import { Button, ButtonProps, SxProps, Theme } from "@mui/material";

interface AppButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function AppButton({ 
  label, 
  onClick, 
  variant = "contained", 
  color = "primary", 
  disabled = false, 
  sx 
}: AppButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      sx={{
        ...sx 
      }}
    >
      {label}
    </Button>
  );
}