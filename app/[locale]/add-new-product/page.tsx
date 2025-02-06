"use client";
import { Button, Grid2 } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "@/i18n/routing";
import AddEditProduct from "../form/AddEditProduct";
const Page = () => {
  const t = useTranslations("Button");
  const router = useRouter();

  return (
    <>
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIosIcon />}
            onClick={() => router.push(`/`)}
          >
            {t("back")}
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <AddEditProduct />
        </Grid2>
      </Grid2>
    </>
  );
};

export default Page;
