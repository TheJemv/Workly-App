import apiClient from "services/api/apiClient";

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
      throw new Error("Paso algo malo..., al obtener tu empresa");
   }
};

export const updateCompany = async (token: string, data: object) => {
   console.log("Funcion...");
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

export const companyRequest = async (token: string, data: RequestData) => {
   try {
      const response = await apiClient.post("/company/request", data, {
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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

export const getByIdCompany = async (id: string) => {
   try {
      const response = await apiClient.get("/company", {
         params: {
            company: id,
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

export const searchCompany = async (search: string) => {
   try {
      const response = await apiClient.get("/company/search", {
         params: {
            q: search,
         },
      });

      return response.data;
   } catch (error) {
      throw new Error(error.response.data.message);
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
      throw new Error(error.response.data.message);
   }
};
