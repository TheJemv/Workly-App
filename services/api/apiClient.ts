import axios from "axios";
import { API_HOST } from "@env";
import { getApp } from "@react-native-firebase/app";
import { getAuth, getIdToken } from "@react-native-firebase/auth";

const apiClient = axios.create({
   baseURL: API_HOST,
   timeout: 20000,
});

apiClient.interceptors.request.use(
   async (config) => {
      const app = getApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (currentUser) {
         const token = await getIdToken(currentUser);
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      console.log("Request Error:", error);
      return Promise.reject(error);
   },
);

apiClient.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      console.error("Response Error:", error);
      return Promise.reject(error);
   },
);

export default apiClient;