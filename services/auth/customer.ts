import apiClient from "services/api/apiClient";

export const customer = async (token: string) => {
   try {
      const response: any = await apiClient
         .get("/customer", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
         .then((response) => {
            return response;
         })
         .catch((e) => {
            console.log(e);
         });

      return response?.data;
   } catch {
      throw new Error("Paso algo malo...");
   }
};
