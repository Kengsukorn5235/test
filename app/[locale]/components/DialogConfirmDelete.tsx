import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

interface DialogConfirmDeleteProps {
  open: boolean;
  onConfirmDelete?: () => void;
  onClose?: () => void;
  itemName: string;
  itemId: number;
}

const DialogConfirmDelete = (props: DialogConfirmDeleteProps) => {
  const t = useTranslations("DialogConfirmDelete");

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth={'sm'}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{t("title")}</DialogTitle>
        <DialogContent sx={{minHeight: 40}}>
          <DialogContentText id="alert-dialog-description">
            {t("description1")}{" "}
            <span
              style={{ fontWeight: 700, fontStyle: "italic", color: "red" }}
            >
              {props.itemName}
            </span>{" "}
            {t("description2")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="inherit" variant="outlined">{t("buttonCancal")}</Button>
          <Button onClick={props.onConfirmDelete} color="error" variant="contained">
          {t("buttonConfirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogConfirmDelete;
