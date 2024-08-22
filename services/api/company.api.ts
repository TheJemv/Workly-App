import { API_HOST } from "@env";
import axios from "axios";

export const getCompany = async (token: string) => {
   try {
      const response: any = await axios
         .get(`${await API_HOST}/company/mycompany`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
         .then((response) => {
            return response;
         });

      return response.data;
   } catch (error) {
      throw new Error("Paso algo malo..., al obtener tu empresa");
   }
};

export const updateCompany = async (token: string, data: object) => {
   try {
      const response = await axios.patch(`${API_HOST}/company`, data, {
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
      const response = await axios.get(`${API_HOST}/company/accountlink`, {
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
