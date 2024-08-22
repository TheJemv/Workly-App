import { API_HOST } from "@env";
import axios from "axios";
export const setService = async (token: string, data: object) => {
   try {
      const response: any = await axios
         .post(`${API_HOST}/service`, data, {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         })
         .then((response) => {
            return response;
         })
         .catch((error) => {
            throw new Error(error.response.data.errors.message);
         });

      if (response.data.errors) throw new Error(response.data.errors.message);
      return response.data;
   } catch (error) {
      throw new Error(error.message);
   }
};

export const delService = async (token: string, id: string) => {
   try {
      const response: any = await axios
         .delete(`${API_HOST}/service/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         })
         .then((response) => {
            return response;
         })
         .catch((error) => {
            throw new Error(error.response.data.errors.message);
         });

      if (response.data.errors) throw new Error(response.data.errors.message);
      return response.data;
   } catch (error) {
      throw new Error(error.message);
   }
};

export const patchService = async (token: string, id: string, obj: object) => {
   try {
      const response: any = await axios
         .patch(`${API_HOST}/service/${id}`, obj, {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         })
         .then((response) => {
            return response;
         })
         .catch((error) => {
            throw new Error(error.response.data.errors.message);
         });

      if (response.data.errors) throw new Error(response.data.errors.message);
      return response.data;
   } catch (error) {
      throw new Error(error.message);
   }
};

export const getServices = async (token: string, category: string) => {
   try {
      const response: any = await axios
         .get(`${API_HOST}/service?category=${category}`, {
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

export const getService = async (token: string, id: string) => {
   try {
      const response: any = await axios
         .get(`${API_HOST}/service/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
         .then((response) => {
            return response;
         })
         .catch((error) => {
            throw new Error(error.response.data.message);
         });

      return response.data;
   } catch (error) {
      throw new Error(error.message);
   }
};

export const getServicePayment = async (token: string, id: string) => {
   try {
      const response: any = await axios
         .get(`${API_HOST}/service/pay/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
         .then((response) => {
            return response;
         })
         .catch((error) => {
            throw new Error(error.response.data.message);
         });

      return response.data;
   } catch (error) {
      throw new Error(error.message);
   }
};
