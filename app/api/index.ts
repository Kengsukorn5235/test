import axios from "axios";

export const instance = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1',
  timeout: 60000,
});

export default class BaseAPI {
  static api = instance;
}
