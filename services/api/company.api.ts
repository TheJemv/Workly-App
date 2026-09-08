import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";

type RequestData = {
   company: string;
   email: string;
   phone: string;
};

export const getCompany = async (token: string) => {
   try {
      const response: any = await apiClient.get("/company/mycompany", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const updateCompany = async (data: object) => {
   try {
      const response = await apiClient.patch("/company", data, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const fetchOnboardingCompany = async (token: string) => {
   try {
      const response = await apiClient.get("/company/accountlink", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const companyRequest = async (data: RequestData) => {
   try {
      const response = await apiClient.post("/company/request", data, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const getByIdCompany = async (id: string) => {
   try {
      const response = await apiClient.get("/company/company", {
         params: {
            id,
         },
      });
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const searchCompany = async (search: string) => {
   try {
      const response = await apiClient.get("/company/search", {
         params: {
            q: search,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

export const getCompnaiesByIds = async (companies: string[]) => {
   try {
      const response = await apiClient.get("/company/companies", {
         params: {
            q: companies,
         },
      });

      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};
