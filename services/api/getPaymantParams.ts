import { API_HOST } from "@env"
import axios from "axios";

export const getPaymantParams = async(token: string) => {
   try {
      const response = await axios.get(`${API_HOST}/customer/payment`, {
         headers: {
            Authorization: `Bearer ${token}`,
         }
      })

      return await response.data
   } catch {
      throw new Error("Error al obtener los datos bancarios")
   }
}

export const setPayment = async(token: string, setupIntent: string) => {
   const response = await fetch(`${API_HOST}/customer/setPayment`, {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         setupIntent: setupIntent
      })
   })

   if(!response.ok) throw new Error("Error para dar de alta la tarjeta.")
   return await response.json();
}