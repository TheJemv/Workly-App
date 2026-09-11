import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";
import type { CompanyLocation } from "@/types/Location";

export interface CompanyLocationInput {
   name: string;
   details: string;
   country: string;
   state: string;
   city: string;
   postalCode: string;
   neighborhood: string;
   street: string;
   streetNumber: string;
   latitude: number;
   longitude: number;
}

/** Sucursales de la empresa autenticada. Mismo patrón que `location.api.ts`. */
export const postCompanyLocation = async (
   data: CompanyLocationInput,
): Promise<{ message: string; id: string }> => {
   try {
      const response = await apiClient.post("/company/locations", data);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

/** Solo sucursales activas (no borradas). */
export const getCompanyLocations = async (): Promise<{
   message: string;
   data: CompanyLocation[];
}> => {
   try {
      const response = await apiClient.get("/company/locations");
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

/** Borrado suave. 204 sin body. */
export const delCompanyLocation = async (id: string): Promise<void> => {
   try {
      await apiClient.delete(`/company/locations/${id}`);
   } catch (error) {
      throw parseApiError(error);
   }
};
