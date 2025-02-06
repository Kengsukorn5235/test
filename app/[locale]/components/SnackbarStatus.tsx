import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

interface PropsSimpleSnackbar {
  open: boolean;
  onClose?: () => void;
  status?: number; // 1 = success, 2 = error
  message?: string;
}

export default function SimpleSnackbar({
  open,
  status = 1,
  message = "บันทึกสำเร็จ",
  onClose,
}: PropsSimpleSnackbar) {
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
      >
        <Alert
          onClose={() => {
            if (onClose) {
              onClose();
            }
          }}
          severity={status === 1 ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
