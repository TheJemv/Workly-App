import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta
import { parseApiError } from "services/api/errors";

export const getPaymentParams = async () => {
   try {
      const response = await apiClient.get("/customer/payment");

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const setPayment = async (token: string, setupIntent: string) => {
   try {
      const response = await apiClient.post(
         "/customer/setPayment",
         {
            setupIntent: setupIntent,
         },
         {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         }
      );

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};
