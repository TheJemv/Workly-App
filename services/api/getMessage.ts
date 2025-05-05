export async function getMessages() {
   const res = await fetch(
      "https://667f08eef2cb59c38dc7dc3a.mockapi.io/api/message"
   );
   if (!res.ok) {
      throw new Error("Paso algo malo...");
   }

   const data = res.json();
   return data;
}

export async function getMessage(id: Number) {
   const res = await fetch(
      `https://667f08eef2cb59c38dc7dc3a.mockapi.io/api/message/${id}`
   );
   if (!res.ok) {
      throw new Error("Paso algo malo...");
   }

   const data = res.json();
   return data;
}
