import axios from "axios";
import { API_HOST } from "@env";
import { getApp } from "@react-native-firebase/app";
import { getAuth, getIdToken } from "@react-native-firebase/auth";

console.log("🔑 API_HOST:", API_HOST);

const apiClient = axios.create({
   baseURL: API_HOST,
   timeout: 20000,
});

apiClient.interceptors.request.use(
   async (config) => {
      try {
         const app = getApp();
         const auth = getAuth(app);
         const currentUser = auth.currentUser;
         if (currentUser) {
            const token = await getIdToken(currentUser);
            config.headers.Authorization = `Bearer ${token}`;
         }
      } catch (error) {
         console.log("⚠️ Error obteniendo token, continuando sin auth:", error.message);
      }
      return config; // ← siempre continúa aunque falle el token
   },
   (error) => {
      return Promise.reject(error);
   },
);

apiClient.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      return Promise.reject(error);
   },
);

export default apiClient;