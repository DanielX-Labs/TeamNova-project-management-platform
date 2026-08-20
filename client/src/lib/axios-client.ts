import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const data = error.response?.data;

    const customError: CustomError = {
      ...error,
      message: data?.message || error.message,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
