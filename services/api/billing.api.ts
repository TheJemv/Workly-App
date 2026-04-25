// import apiClient from "services/api/apiClient";

import apiClient from "./apiClient";

export const postBilling = async (token: string, data: {}) => {
   try {
      const response: any = await apiClient.post("/billing", data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

export const getBillings = async () => {
   try {
      const response: any = await apiClient.get("/billing");
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
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
      throw new Error((error as Error).message);
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
      throw new Error((error as Error).message);
   }
};