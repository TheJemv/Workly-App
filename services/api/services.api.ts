import apiClient from "services/api/apiClient"; // Asegúrate de que esta ruta sea correcta

export const setService = async (data: object) => {
   try {
      const response = await apiClient.post("/service", data, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (response.data.errors) throw new Error(response.data.errors.message);
      return response.data;
   } catch (error) {
      throw new Error(error.message || "Error al crear el servicio");
   }
};

export const delService = async (token: string, id: string) => {
   try {
      const response = await apiClient.delete(`/service/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
      });

      if (response.data.errors) throw new Error(response.data.errors.message);
      return response.data;
   } catch (error) {
      throw new Error(error.message || "Error al eliminar el servicio");
   }
};

export const patchService = async (id: string, obj: object) => {
   try {
      const response = await apiClient.patch(`/service/${id}`, obj, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (response.data.errors) throw new Error(response.data.errors.message);
      return response.data;
   } catch (error) {
      throw new Error(error.message || "Error al actualizar el servicio");
   }
};

export const getServices = async (token: string, category: string) => {
   try {
      const response = await apiClient.get(`/service?category=${category}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error(error.message || "Error al obtener los servicios");
   }
};

export const getService = async (token: string, id: string) => {
   try {
      const response = await apiClient.get(`/service/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error(error.message || "Error al obtener el servicio");
   }
};

export const getServicePayment = async (
   token: string,
   id: string,
   data: object,
) => {
   try {
      const response = await apiClient.post(`/service/pay/${id}`, data, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error(
         error.message || "Error al procesar el pago del servicio",
      );
   }
};
