import { API_HOST } from "@env";
import axios from "axios";

export const customer = async (token: string) => {
   try {
      const response: any = await axios
         .get(`${await API_HOST}/customer`, {
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
