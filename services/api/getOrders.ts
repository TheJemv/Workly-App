export async function getOrders() {
   const res = await fetch(
      "https://667f08eef2cb59c38dc7dc3a.mockapi.io/api/orders"
   );
   if (!res.ok) {
      throw new Error("Paso algo malo...");
   }

   const data = res.json();
   return data;
}

export async function getOrder(id: Number) {
   const res = await fetch(
      `https://667f08eef2cb59c38dc7dc3a.mockapi.io/api/orders/${id}`
   );
   if (!res.ok) {
      throw new Error("Paso algo malo...");
   }

   const data = await res.json();
   return data;
}
