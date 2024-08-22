import { API_HOST } from "@env";
import axios from "axios";

export const updatedCustomer = async (token: string, data: object) => {
   try {
      const response: any = await axios.patch(
         `${await API_HOST}/customer`,
         data,
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );

      return response?.data;
   } catch (error) {
      return error.message;
   }
};
