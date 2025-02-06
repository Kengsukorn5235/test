import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// mui
import {
  Autocomplete,
  Box,
  Button,
  Grid2,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

//formik
import { Form, Formik } from "formik";
import * as Yup from "yup";
import UploadMultipleImagesWithPreview from "./component/UploadImage";

// api
import ProductAPI from "@/app/api/products";
import CategoryAPI from "@/app/api/category";
import { getCategoryInterface } from "@/app/api/category/interfaces/response";
import { CreateProductDataInterface } from "@/app/api/products/interfaces/request";
import { useRouter } from "@/i18n/routing";

import SimpleSnackbar from "../components/SnackbarStatus";

const AddEditProduct = () => {
  const t = useTranslations("Stepper");
  const tBtn = useTranslations("Button");
  const tProduct = useTranslations("Product");

  const router = useRouter();

  const steps = [t("step1"), t("step2"), t("step3")];

  const [currentStep, setCurrentStep] = React.useState<number>(0);

  const [categoryData, setCategoryData] =
    React.useState<getCategoryInterface[]>();
  const [imageUrls, setImageUrls] = React.useState<Array<string>>([]);

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>();
  const [snackbarStatus, setSnackbarStatus] = React.useState<number>(1);

  const getDropDownCategory = async () => {
    try {
      const resData = await CategoryAPI.getData();

      setCategoryData(resData.data);
    } catch {}
  };

  const createProduct = async (data: CreateProductDataInterface) => {
    try {
      await ProductAPI.createProduct(data);

      setSnackbarOpen(true);
      setSnackbarMessage("บันทึกสำเร็จ");
      setSnackbarStatus(1);
      router.back();
    } catch {
      setSnackbarOpen(true);
      setSnackbarMessage("บันทึกไม่สำเร็จ");
      setSnackbarStatus(2);
    }
  };

  React.useEffect(() => {
    getDropDownCategory();
  }, []);
  return (
    <>
      <Grid2 container mt={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid2>
      </Grid2>

      <Formik
        initialValues={{
          title: "",
          price: undefined,
          description: "",
          categoryId: undefined,
          categoryName: undefined,
          images: [],
        }}
        validationSchema={Yup.object().shape({
          // images: Yup.array().of(Yup.string()).required("images is required"),
          title: Yup.string().required("product name is required"),
          price: Yup.number().required("price is required"),
          description: Yup.string().required("description is required"),
          categoryId: Yup.number().required("category is required"),
        })}
        onSubmit={(value: CreateProductDataInterface) => {
          const newData = { ...value, images: imageUrls };
          createProduct(newData);
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          handleSubmit,
          setFieldTouched,
        }) => (
          <>
            <Form>
              <Grid2 container>
                <Grid2 size={12}>
                  <Paper>
                    <Grid2 container mt={3} px={3} py={4}>
                      <Grid2 size={{ xs: 12 }} minHeight={"50vh"}>
                        {currentStep === 0 && (
                          <Grid2 container>
                            <Grid2
                              size={{ xs: 12, sm: 6 }}
                              margin={"auto"}
                              spacing={2}
                              rowGap={2}
                              display={"flex"}
                              flexDirection={"column"}
                            >
                              <Typography variant="h5">
                                {tProduct("productName")}
                              </Typography>
                              <TextField
                                value={values.title}
                                onChange={handleChange}
                                name="title"
                                label={tProduct("productName")}
                                fullWidth
                                error={Boolean(errors.title && touched.title)}
                                helperText={errors.title}
                              />
                              <Typography variant="h5">
                                {tProduct("description")}
                              </Typography>
                              <TextField
                                value={values.description}
                                onChange={handleChange}
                                name="description"
                                label={tProduct("description")}
                                fullWidth
                                multiline
                                rows={4}
                                error={Boolean(
                                  errors.description && touched.description
                                )}
                                helperText={errors.description}
                              />
                            </Grid2>
                          </Grid2>
                        )}
                        {currentStep === 1 && (
                          <Grid2 container>
                            <Grid2
                              size={{ xs: 12, sm: 6 }}
                              margin={"auto"}
                              spacing={2}
                              gap={2}
                              display={"flex"}
                              flexDirection={"column"}
                            >
                              <Typography variant="h5">
                                {tProduct("price")}
                              </Typography>

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

                                  if (value > 99999)
                                    value = values.price ?? 99999;
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
                              <Typography variant="h5">
                                {tProduct("category")}
                              </Typography>
                              <Autocomplete
                                options={categoryData ?? []}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={tProduct("category")}
                                    error={Boolean(
                                      !values.categoryId && touched.categoryId
                                    )}
                                    helperText={errors.categoryId}
                                    name="categoryId"
                                  />
                                )}
                                value={
                                  categoryData?.find(
                                    (cat) => cat.id === values.categoryId
                                  ) || null
                                }
                                onChange={(e, value) => {
                                  setFieldValue("categoryId", value?.id);
                                  setFieldValue("categoryName", value?.name);
                                }}
                                sx={{ minWidth: "50%" }}
                              />
                            </Grid2>
                          </Grid2>
                        )}
                        {currentStep === 2 && (
                          <Grid2 container>
                            <Grid2
                              size={{ xs: 12, sm: 6 }}
                              margin={"auto"}
                              spacing={2}
                              rowGap={2}
                              display={"flex"}
                              flexDirection={"column"}
                            >
                              <Grid2 size={12}>
                                <UploadMultipleImagesWithPreview
                                  onUploadComplete={setImageUrls}
                                  img={imageUrls}
                                />
                              </Grid2>
                            </Grid2>
                          </Grid2>
                        )}
                        {currentStep === 3 && (
                          <>
                            <Grid2 container>
                              <Grid2 size={{ xs: 12, sm: 6 }} margin={"auto"}>
                                <Typography
                                  variant="h5"
                                  align="center"
                                  gutterBottom
                                >
                                  ยืนยันข้อมูล
                                </Typography>
                                <Typography>
                                  <span style={{ fontWeight: 700 }}>
                                    ชื่อสินค้า :{" "}
                                  </span>
                                  {values.title}
                                </Typography>

                                <Typography>
                                  <span style={{ fontWeight: 700 }}>
                                    ราคา :{" "}
                                  </span>
                                  {values.price}
                                </Typography>
                                <Typography>
                                  <span style={{ fontWeight: 700 }}>
                                    รายละเอียดสินค้า :{" "}
                                  </span>
                                  {values.description}
                                </Typography>
                                <Typography>
                                  <span style={{ fontWeight: 700 }}>
                                    หมวดหมู่ :{" "}
                                  </span>
                                  {values.categoryName}
                                </Typography>
                                <Grid2 container mt={3}>
                                  <Grid2 size={12}>
                                    <Typography>
                                      <span style={{ fontWeight: 700 }}>
                                        รูปภาพ :{" "}
                                      </span>
                                    </Typography>
                                    <Grid2 size={12} display={"flex"} gap={1}>
                                      {imageUrls.map((url, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            position: "relative",
                                            width: "100px",
                                            textAlign: "center",
                                          }}
                                        >
                                          <Image
                                            src={url}
                                            alt={`Uploaded ${index}`}
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              objectFit: "cover",
                                              borderRadius: "8px",
                                            }}
                                            width={100}
                                            height={100}
                                            unoptimized
                                          />
                                        </div>
                                      ))}
                                    </Grid2>
                                  </Grid2>
                                </Grid2>
                              </Grid2>
                            </Grid2>
                          </>
                        )}
                      </Grid2>
                    </Grid2>
                  </Paper>
                  <Grid2 container mt={2}>
                    <Grid2
                      size={{ xs: 12 }}
                      display={"flex"}
                      justifyContent={"flex-end"}
                      gap={1.5}
                    >
                      <Button
                        disabled={Boolean(currentStep === 0)}
                        onClick={() =>
                          setCurrentStep((previous) => previous - 1)
                        }
                        variant="outlined"
                        color="inherit"
                      >
                        {tBtn("back")}
                      </Button>
                      {currentStep <= 2 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (
                              currentStep === 0 &&
                              Boolean(!values.title || !values.description)
                            ) {
                              setFieldTouched("title", true);
                              setFieldTouched("description", true);
                            } else if (
                              currentStep === 1 &&
                              Boolean(!values.price || !values.categoryId)
                            ) {
                              setFieldTouched("price", true);
                              setFieldTouched("categoryId", true);
                            } else if (
                              currentStep === 2 &&
                              Boolean(imageUrls.length === 0)
                            ) {
                              alert("กรุณาอัพโหลดรูปอย่างน้อย 1 รูป");
                            } else {
                              console.log(values.categoryId);
                              setCurrentStep((previous) => previous + 1);
                            }
                          }}
                        >
                          {tBtn("next")}
                        </Button>
                      )}
                      {currentStep === 3 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleSubmit();
                            // console.log(imageUrls);
                          }}
                        >
                          {tBtn("save")}
                        </Button>
                      )}
                    </Grid2>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Form>
          </>
        )}
      </Formik>

      <SimpleSnackbar
        open={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        message={snackbarMessage}
        status={snackbarStatus}
      />
    </>
  );
};

export default AddEditProduct;
