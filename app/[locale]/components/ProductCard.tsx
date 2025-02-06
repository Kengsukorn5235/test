import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { GetProductDataAPI } from "@/app/api/products/interfaces/response";

export default function ProductCard(productData: GetProductDataAPI) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={
          <Typography variant="h6" fontSize={18} fontWeight={600}>
            {productData.title.length > 20
              ? productData.title.slice(0, 29) + "..."
              : productData.title}
          </Typography>
        }
        // sx={{height: 50}}
      />
      <CardMedia
        component="img"
        height="194"
        image={productData.images[0]}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {productData.description.length > 90
            ? productData.description.slice(0, 99) + "..."
            : productData.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
