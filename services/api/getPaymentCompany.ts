import { API_HOST } from "@env"

export const getPaymantCompany = async (token: string) => {
   const response = await fetch(`${API_HOST}/company/subscription`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   if(!response.ok) {
      throw new Error("Error para conseguir la key")
   }
   
   const data = await response.json();
   return data
}

export const getPaymentCompanyVerify = async (token: string, paymentIntent: string) => {
   const response = await fetch(`${API_HOST}//company/verify-payment`, {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         paymentIntentId: paymentIntent
      })
   })

   if (!response.ok) {
      throw new Error("Error para verificar la suscripcion.")
   }

   const data = await response.json()
   return data
}