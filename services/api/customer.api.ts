import { API_HOST } from "@env";
import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const updatedCustomer = async (token: string, data: object) => {
   try {
      const response: any = await apiClient.patch(
         "/customer", // Usamos la ruta base configurada en apiClient
         data,
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );

      return response?.data;
   } catch (error) {
      return error.message || "Algo salió mal al actualizar el cliente";
   }
};
