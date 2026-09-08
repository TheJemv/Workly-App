import apiClient from "./apiClient";
import { parseApiError } from "./errors";

export const postBilling = async (token: string, data: {}) => {
   try {
      const response: any = await apiClient.post("/billing", data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const getBillings = async () => {
   try {
      const response: any = await apiClient.get("/billing");
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const delBilling = async (token: string, id: string) => {
   try {
      const response: any = await apiClient.delete("/billing", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
         params: {
            id,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const patchBilling = async (id: string, data: {}) => {
   try {
      const response: any = await apiClient.patch("/billing", data, {
         params: {
            id,
         },
      });
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};
