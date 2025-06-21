import axios from "axios";
import { RV_API_V1 } from "@env";

const apiRevenueCatClient = axios.create({
   baseURL: "https://api.revenuecat.com/v1",
});

export const getSubscriptionStatus = async (user: string) => {
   try {
      const response = await apiRevenueCatClient.get(`/subscribers/${user}`, {
         headers: {
            Authorization: RV_API_V1,
            "Content-Type": "application/json",
         },
      });

      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};
