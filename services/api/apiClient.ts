import axios from "axios";

const apiClient = axios.create({
   baseURL: "http://192.168.0.178:8080/",
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
