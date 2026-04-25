import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const updatedCustomer = async (data: object) => {
   try {
      const response: any = await apiClient.patch("/customer", data);
      return response?.data;
   } catch (error) {
      return error.message || "Algo salió mal al actualizar el cliente";
   }
};

export const trandingCustomer = async (): Promise<any> => {
   console.log("1️⃣ entrando a trandingCustomer");
   try {
      console.log("2️⃣ antes del interceptor");
      const response = await apiClient.get("/customer/trending");
      console.log("3️⃣ respuesta recibida:", response?.status);
      return response?.data;
   } catch (error) {
      console.log("4️⃣ error:", error.message, error.code);
      throw error;
   }
};

export const deleteCustomer = async () => {
   try {
      const response = await apiClient.delete("/customer");
      return response?.data;
   } catch (error) {
      return error.message || "Algo salio mal.";
   }
};