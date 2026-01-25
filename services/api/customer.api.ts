import { getAuth } from "firebase/auth";
import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const updatedCustomer = async (token: string, data: object) => {
   try {
      console.log(data, token);
      const response: any = await apiClient.patch("/customer", data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response?.data;
   } catch (error) {
      return error.message || "Algo salió mal al actualizar el cliente";
   }
};

export const trandingCustomer = async (): Promise<any> => {
   try {
      const response = await apiClient.get("/customer/trending");
      return response?.data;
   } catch (error) {
      return error.message || "Algo salio mal.";
   }
};
