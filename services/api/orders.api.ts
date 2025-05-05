import apiClient from "./apiClient";

export const cancelOrder = async (token: string, id: string) => {
   try {
      const response = await apiClient.get(`/orders/cancel/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

export const nextOrder = async (token: string, id: string) => {
   try {
      const response = await apiClient.get(`/orders/next/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};
