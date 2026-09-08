import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";

export const setService = async (data: object) => {
   try {
      const response = await apiClient.post("/service", data, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
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

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const patchService = async (id: string, obj: object) => {
   try {
      const response = await apiClient.patch(`/service/${id}`, obj, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const getServices = async (category: string) => {
   try {
      const response = await apiClient.get(`/service?category=${category}`);

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const getService = async (id: string) => {
   try {
      const response = await apiClient.get(`/service/service`, {
         params: {
            id,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
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
      throw parseApiError(error);
   }
};
