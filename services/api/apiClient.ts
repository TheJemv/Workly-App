import axios from "axios";
import { API_HOST } from "@env";
import { getAuth } from "firebase/auth";

const apiClient = axios.create({
   baseURL: API_HOST,
   timeout: 20000,
});

apiClient.interceptors.request.use(
   async (config) => {
      const credentials = getAuth().currentUser;
      const token = await credentials.getIdToken();
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      console.log("Request Error:", error);
      return Promise.reject(error);
   },
);

axios.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      console.error("Response Error:", error);
      return Promise.reject(error);
   },
);

export default apiClient;
