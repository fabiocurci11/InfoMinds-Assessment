import { TextField, TextFieldProps, SxProps, Theme } from "@mui/material";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  variant?: TextFieldProps["variant"];
  size?: TextFieldProps["size"];
  sx?: SxProps<Theme>;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  name,
  variant = "outlined",
  size = "small",
  sx,
}: InputFieldProps) {
  return (
    <TextField
      fullWidth 
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      name={name}
      variant={variant}
      size={size}
      sx={{ ...sx }}
    />
  );
}