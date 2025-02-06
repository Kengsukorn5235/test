import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslations } from "next-intl";
import { Grid2, TextField, Typography } from "@mui/material";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import ProductAPI from "@/app/api/products";
import { GetSingleProductDataAPI } from "@/app/api/products/interfaces/response";
import { UpdateProductDataInterface } from "@/app/api/products/interfaces/request";
import SimpleSnackbar from "./SnackbarStatus";

interface PropsDialogEdit {
  productData: GetSingleProductDataAPI;
  open: boolean;
  onClose?: () => void;
  onSave?: () => void;
}
export default function DialogEdit(props: PropsDialogEdit) {
  //   const formRef = React.useRef();
  const formRef = React.useRef<FormikProps<UpdateProductDataInterface> | null>(
    null
  );

  const tProduct = useTranslations("Product");
  const tEditProduct = useTranslations("EditProduct");

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>();
  const [snackbarStatus, setSnackbarStatus] = React.useState<number>(1);

  const updateProduct = async (data: UpdateProductDataInterface) => {
    try {
      await ProductAPI.updateProduct(data.id, {
        id: data.id,
        title: data.title,
        price: data.price,
      });
      if (props.onSave) {
        props.onSave();
      }
      setSnackbarOpen(true);
      setSnackbarMessage("บันทึกสำเร็จ");
      setSnackbarStatus(1);
    } catch {
      setSnackbarOpen(true);
      setSnackbarMessage("บันทึกไม่สำเร็จ");
      setSnackbarStatus(2);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {tEditProduct("title")}
        </DialogTitle>
        <DialogContent>
          <Formik
            innerRef={formRef}
            initialValues={props.productData}
            validationSchema={Yup.object().shape({
              title: Yup.string().required("title is required"),
              price: Yup.number().required("price is required"),
            })}
            onSubmit={(value: UpdateProductDataInterface) => {
              updateProduct(value);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <>
                <Grid2 container py={3}>
                  <Grid2 size={10}>
                    <Grid2 container spacing={1.5} mb={2}>
                      <Grid2 size={{ xs: 4 }} alignContent={"center"}>
                        <Typography variant="body1" align="right">
                          {tProduct("productName")} :
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 8 }}>
                        <TextField
                          label={tProduct("productName")}
                          size="small"
                          fullWidth
                          value={values.title}
                          name="title"
                          onChange={handleChange}
                          error={Boolean(errors.title && touched.title)}
                        />
                      </Grid2>
                    </Grid2>
                    <Grid2 container spacing={1.5}>
                      <Grid2 size={{ xs: 4 }} alignContent={"center"}>
                        <Typography variant="body1" align="right">
                          {tProduct("price")} :
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 8 }}>
                        <TextField
                          label={tProduct("price")}
                          id="filled-start-adornment"
                          inputProps={{
                            inputMode: "tel",
                            min: 0,
                            max: 999,
                            step: 1,
                            pattern: "[0-9]*",
                          }}
                          value={values.price}
                          onChange={(e) => {
                            let value = parseInt(e.target.value, 10);

                            if (value > 99999) value = values.price ?? 99999;
                            if (value < 1) value = 1;
                            if (!value) value = 0;

                            setFieldValue("price", value);
                          }}
                          name="price"
                          type="tel"
                          sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                              {
                                WebkitAppearance: "none",
                              },
                            minWidth: "50%",
                          }}
                          error={Boolean(errors.price && touched.price)}
                          helperText={errors.price}
                          size="small"
                        />
                      </Grid2>
                    </Grid2>
                  </Grid2>
                </Grid2>
              </>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} variant="outlined" color="inherit">
            {tEditProduct("cancel")}
          </Button>
          <Button
            onClick={() => formRef.current?.handleSubmit()}
            variant="contained"
            color="primary"
          >
            {tEditProduct("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <SimpleSnackbar
        open={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        message={snackbarMessage}
        status={snackbarStatus}
      />
    </React.Fragment>
  );
}
