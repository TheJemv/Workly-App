import axios from "axios";

const apiClient = axios.create({
   baseURL: "https://api.workly.store/",
   timeout: 5000,
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
