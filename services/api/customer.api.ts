import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";

export const updatedCustomer = async (data: object) => {
   try {
      const response: any = await apiClient.patch("/customer", data);
      return response?.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const trandingCustomer = async (): Promise<any> => {
   try {
      const response = await apiClient.get("/customer/trending");
      return response?.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const deleteCustomer = async () => {
   try {
      const response = await apiClient.delete("/customer");
      return response?.data;
   } catch (error) {
      throw parseApiError(error);
   }
};
