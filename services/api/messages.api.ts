import { API_HOST } from "@env";
import axios from "axios";

export const getMessages = async (token: string, id: string) => {
   try {
      const response: any = await axios
         .get(`${API_HOST}/message`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
         .then((response) => {
            return response;
         })
         .catch((error) => {
            throw new Error(error);
         });

      return response.data;
   } catch (error) {
      throw new Error(error.message);
   }
};
