import { Typography, SxProps, Theme, TypographyProps } from "@mui/material";

interface HeaderProps {
  title: string;
  variant?: TypographyProps["variant"]; 
  sx?: SxProps<Theme>;
}

export default function Header({ title, variant = "h4", sx }: HeaderProps) {
  return (
    <Typography 
      variant={variant} 
      sx={{ 
        textAlign: "center", 
        mt: 4, 
        mb: 4,
        ...sx 
      }}
    >
      {title}
    </Typography>
  );
}