import BaseAPI from "..";
import { getCategoryInterface } from "./interfaces/response";

export default class CategoryAPI extends BaseAPI {
  static getData(): Promise<{ data: getCategoryInterface[] }> {
    return this.api.get(`/categories`);
  }
}
