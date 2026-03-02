import { Snackbar, Alert, AlertColor } from "@mui/material";

interface AppToastProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // "success" | "info" | "warning" | "error"
  onClose: () => void;
  duration?: number;
}

export default function AppToast({
  open,
  message,
  severity = "success",
  onClose,
  duration = 4000,
}: AppToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: "100%", boxShadow: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}