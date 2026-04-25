import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const getPaymentParams = async () => {
   try {
      const response = await apiClient.get("/customer/payment");

      return response.data;
   } catch (error) {
      console.log(error)
      throw new Error("Error al obtener los datos bancarios");
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
      throw new Error(error.message || "Error al dar de alta la tarjeta");
   }
};
