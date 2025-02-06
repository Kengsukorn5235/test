export interface GetProductData {
  limit: number;
  offset: number;
}

export interface CreateProductDataInterface {
  title: string;
  price?: number;
  description: string;
  categoryId?: number;
  categoryName?: string;
  images: Array<string>;
  // images: any;
}

// export interface UpdateProductDataInterface extends CreateProductDataInterface {
//   id?: number;
// }

export interface UpdateProductDataInterface {
  id: number
  title: string;
  price?: number;
}