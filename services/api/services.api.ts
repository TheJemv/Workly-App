import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";
import type { AddonSelection, Service, ServicePricing } from "@/types/Service";

export interface PayServiceBody {
   dateRequest: string;                 // ISO, futura, dentro de businessHours
   // uuid de una dirección propia del cliente (`GET /location`). Obligatorio
   // SOLO si `service.locationMode === "customer_location"`; en "not_required"
   // no se manda, y en "company_location" el backend ya sabe la sucursal (si
   // se manda algo, se ignora).
   location: string | null;
   billing: string | null;              // uuid; hoy siempre null (se maneja por chat)
   notes: string | null;
   addonSelections: AddonSelection[];    // servicios de precio fijo
   customPrice?: number | null;          // SOLO servicios indefinite (>= 4999)
   // Cantidad de intervalos (ej. noches). Solo aplica si `service.interval` no
   // es null; si se manda y el servicio no maneja intervalos, el backend lo
   // ignora. Si no se manda y el servicio SÍ maneja intervalos, el backend
   // asume `interval.minQuantity`.
   intervalCount?: number | null;
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
      /** @deprecated espejo de `photos[0]`. */
      photo: string;
      photos?: string[];
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

export interface ServiceCategoryCount {
   category: string;
   count: number;
}

/**
 * Público. Categorías que HOY tienen al menos un servicio disponible para
 * comprar (empresa pública + completa, servicio no borrado). Para el home.
 * Orden: `count` desc, luego nombre asc. Puede venir vacío.
 */
export const getServiceCategories = async (): Promise<{
   categories: ServiceCategoryCount[];
}> => {
   try {
      const response = await apiClient.get("/service/categories");

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

/**
 * Público. Catálogo completo de categorías válidas (todos los valores de
 * `ServiceCategoryEnum`, tengan o no oferta). Para el selector al crear/editar
 * un servicio. Nunca viene vacío.
 */
export const getServiceCategoryCatalog = async (): Promise<{
   categories: string[];
}> => {
   try {
      const response = await apiClient.get("/service/categories/catalog");

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
