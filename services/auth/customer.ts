import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";

export const customer = async (token: string) => {
   try {
      const response = await apiClient.get("/customer", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response?.data;
   } catch (error) {
      throw parseApiError(error);
   }
};
