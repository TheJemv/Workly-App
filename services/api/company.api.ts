import apiClient from "services/api/apiClient";

export const getCompaniesRecommended = async (token: string) => {
   try {
      const response: any = await apiClient.get("/company/recommended", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error("Ocurrió un error al obtener las empresas");
   }
};

export const getCompanyById = async (token: string, id: string) => {
   try {
      const response: any = await apiClient.get(`/company/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error("Paso algo malo..., al obtener la empresa");
   }
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
      throw new Error("Paso algo malo..., al obtener tu empresa");
   }
};

export const updateCompany = async (token: string, data: object) => {
   try {
      const response = await apiClient.patch("/company", data, {
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
      });

      if (response.data.errors) {
         throw new Error(response.data.errors.message);
      }

      return response.data;
   } catch (error) {
      if (error.response && error.response.data) {
         throw new Error(error.response.data.message || "Something went wrong");
      } else {
         throw new Error(error.message);
      }
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
      if (error.response && error.response.data) {
         throw new Error(error.response.data.message || "Something went wrong");
      } else {
         throw new Error(error.message);
      }
   }
};
