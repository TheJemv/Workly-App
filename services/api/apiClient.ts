import axios from "axios";
import { API_HOST } from "@env";

const apiClient = axios.create({
   baseURL: API_HOST,
   timeout: 20000,
});

apiClient.interceptors.request.use(
   (config) => {
      return config;
   },
   (error) => {
      console.log("Request Error:", error);
      return Promise.reject(error);
   }
);

axios.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      console.error("Response Error:", error);
      return Promise.reject(error);
   }
);

export default apiClient;
