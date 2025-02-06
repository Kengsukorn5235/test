export interface GetProductDataAPI {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: Array<string>;
}

export interface GetSingleProductDataAPI {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: Array<string>;
}

export interface propsProductSingle {
  data: GetSingleProductDataAPI;
}
