import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const getPaymentCompany = async (token: string) => {
   try {
      const response = await apiClient.get("/company/subscription", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error("Error para conseguir la key");
   }
};

export const getPaymentCompanyVerify = async (
   token: string,
   paymentIntent: string
) => {
   try {
      const response = await apiClient.post(
         "/company/verify-payment",
         {
            paymentIntentId: paymentIntent,
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
      throw new Error("Error para verificar la suscripción.");
   }
};
