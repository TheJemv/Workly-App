import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const getMessages = async (token: string, id: string) => {
   try {
      const response = await apiClient.get("/message", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error(error.message || "Error al obtener los mensajes");
   }
};
