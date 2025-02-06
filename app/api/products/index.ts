import BaseAPI from "..";
import {
  CreateProductDataInterface,
  GetProductData,
  UpdateProductDataInterface,
} from "./interfaces/request";
import {
  GetProductDataAPI,
  GetSingleProductDataAPI,
} from "./interfaces/response";

export default class ProductAPI extends BaseAPI {
  static getData(): Promise<{ data: GetProductDataAPI[] }> {
    return this.api.get(`/products`);
  }

  static getAllProductData(
    params: GetProductData
  ): Promise<{ data: GetProductDataAPI[] }> {
    return this.api.get(`/products`, {
      params: { ...params },
    });
  }

  static getSingleProduct(
    id: number
  ): Promise<{ data: GetSingleProductDataAPI }> {
    return this.api.get(`/products/${id}`);
  }

  static createProduct(
    data: CreateProductDataInterface
  ): Promise<{ data: GetProductDataAPI[] }> {
    return this.api.post(`products/`, data);
  }

  static updateProduct(
    id: number,
    data: UpdateProductDataInterface
  ): Promise<{ data: GetProductDataAPI[] }> {
    return this.api.put(`products/${id}`, data);
  }

  static deleteProduct(productId: number): Promise<boolean> {
    return this.api.delete(`/products/${productId}`);
  }
}
