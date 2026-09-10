import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";
import type { AddonSelection, Service, ServicePricing } from "@/types/Service";

export interface PayServiceBody {
   dateRequest: string;                 // ISO, futura, dentro de businessHours
   location: string | null;             // uuid; requerido si service.requiresLocation
   billing: string | null;              // uuid; hoy siempre null (se maneja por chat)
   notes: string | null;
   addonSelections: AddonSelection[];    // servicios de precio fijo
   customPrice?: number | null;          // SOLO servicios indefinite (>= 4999)
}

export interface PayServiceResponse {
   message: string;
   paymentintent: string;               // client secret — nombre EXACTO en minúsculas
   ephemeralKey: string;
   customerId: string;
   pricing: ServicePricing;
   serviceSnapshot: {
      id: string;
      name: string;
      description: string;
      photo: string;
      currency: string;
      company: { id: string; name: string };
   };
   service: Service;                     // entidad completa (incluye company.profile)
}

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
   id: string,
   body: PayServiceBody,
): Promise<PayServiceResponse> => {
   try {
      // El interceptor de apiClient ya inyecta el Bearer token.
      const response = await apiClient.post(`/service/pay/${id}`, body);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};
