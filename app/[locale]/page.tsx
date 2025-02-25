"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

// api
import ProductAPI from "../api/products";
import {
  GetProductDataAPI,
  GetSingleProductDataAPI,
} from "../api/products/interfaces/response";

// mui
import { Grid2, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DialogConfirmDelete from "./components/DialogConfirmDelete";
import DialogEdit from "./components/DialogEdit";
import SimpleSnackbar from "./components/SnackbarStatus";

export default function HomePage() {
  const t = useTranslations("HomePage");

  const [page, setPage] = React.useState<number>(0);
  const [pageRow, setPageRow] = React.useState<number>(10);
  const [totalRows, setTotalRows] = React.useState<number>(30);

  const [products, setProducts] = React.useState<Array<GetProductDataAPI>>([]);

  const [dialogEditOpen, setDialogEditOpen] = React.useState<boolean>(false);

  const [dialogConfirmDelete, setDialogConfirmDelete] =
    useState<boolean>(false);
  const [itemDelete, setItemDelete] = React.useState<{
    itemName: string;
    itemId: number;
  }>({ itemId: 0, itemName: "" });

  const [productData, setProductData] = React.useState<GetSingleProductDataAPI>(
    {
      id: 0,
      title: "",
      price: 0,
      description: "",
      category: {
        id: 0,
        name: "",
        image: "",
      },
      images: [],
    }
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>();
  const [snackbarStatus, setSnackbarStatus] = React.useState<number>(1);

  const getProduct = async () => {
    const newOffset = page * 10;
    try {
      const res = await ProductAPI.getAllProductData({
        limit: pageRow,
        offset: newOffset,
      });

      setProducts(res.data);

      const resAll = await ProductAPI.getData();
      setTotalRows(resAll.data.length);
    } catch { }
  };

  const getSingleProduct = async (productId: number) => {
    try {
      const result = await ProductAPI.getSingleProduct(productId);
      setProductData(result.data);
    } catch {
    } finally {
      setDialogEditOpen(true);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      await ProductAPI.deleteProduct(productId);

      setDialogConfirmDelete(false);
      getProduct();

      setSnackbarOpen(true);
      setSnackbarMessage("ลบสำเร็จ");
      setSnackbarStatus(2);
    } catch {
      setSnackbarOpen(true);
      setSnackbarMessage("ลบไม่สำเร็จ");
      setSnackbarStatus(2);
    }
  };

  React.useEffect(() => {
    getProduct();
  }, [page]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "No",
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return <>{products.findIndex((row) => row.id === params.id) + 1}</>;
      },
    },
    {
      field: "image",
      headerName: "Image",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <Image
              alt=""
              src={params.row.images[0]}
              style={{ objectFit: "cover", height: 50 }}
              width={50}
              height={50}
            />
          </>
        );
      },
    },
    { field: "title", headerName: "Product", flex: 1, minWidth: 300 },
    {
      field: "price",
      headerName: "Price",
      disableColumnMenu: true,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <Typography variant="body1" sx={{ mt: 1.5 }}>{`${params.row.price
              } ${t("price")}`}</Typography>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              sx={{ mt: 0.6 }}
              spacing={1}
            >
              <IconButton
                color="success"
                onClick={() => {
                  getSingleProduct(params.row.id);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  setItemDelete({
                    itemId: params.row.id,
                    itemName: params.row.title,
                  });
                  setDialogConfirmDelete(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Grid2 container>
        <Grid2 size={12}>
          <Typography variant="h3">{t("title")}</Typography>
          <Typography variant="body1">{t("description")}</Typography>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={2}>
        <DataGrid
          getRowId={(item) => item.id}
          columns={columns}
          rows={products}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={{ page: page, pageSize: pageRow }}
          onPaginationModelChange={(newModel) => {
            setPage(newModel.page);
            setPageRow(newModel.pageSize);
          }}
          pageSizeOptions={[pageRow]}
        />
      </Grid2>

      <DialogConfirmDelete
        open={dialogConfirmDelete}
        onClose={() => setDialogConfirmDelete(false)}
        onConfirmDelete={() => deleteProduct(itemDelete.itemId)}
        itemId={itemDelete.itemId}
        itemName={itemDelete.itemName}
      />

      <DialogEdit
        productData={productData}
        open={dialogEditOpen}
        onClose={() => setDialogEditOpen(false)}
        onSave={() => {
          setDialogEditOpen(false);
          getProduct();
        }}
      />

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
}
