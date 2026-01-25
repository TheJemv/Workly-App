import apiClient from "./apiClient";

// export const cancelOrder = async (token: string, id: string) => {
//    try {
//       const response = await apiClient.get(`/orders/cancel/${id}`, {
//          headers: {
//             Authorization: `Bearer ${token}`,
//          },
//       });
//       return response.data;
//    } catch (error) {
//       throw new Error((error as Error).message);
//    }
// };

// export const nextOrder = async (token: string, id: string) => {
//    try {
//       const response = await apiClient.get(`/orders/next/${id}`, {
//          headers: {
//             Authorization: `Bearer ${token}`,
//          },
//       });
//       return response.data;
//    } catch (error) {
//       throw new Error((error as Error).message);
//    }
// };




// Orders
// ===== EMPRESA: Acepta orden sin cambios =====
export const acceptOrder = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/accept-order/${id}`);
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

// ===== EMPRESA: Modifica fecha de entrega =====
export const modifyDeliveryDate = async (id: string, newDeliveryDate: string) => {
   try {
      const response = await apiClient.post(`/orders/modify-delivery-date/${id}`, {
         newDeliveryDate,
      });
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

// ===== CLIENTE: Aprueba cambio de fecha =====
export const approveDateChange = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/approve-date-change/${id}`);
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

// ===== CLIENTE: Rechaza cambio de fecha =====
export const rejectDateChange = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/reject-date-change/${id}`);
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

// ===== EMPRESA: Confirma entrega (después de 45 min) =====
export const confirmDelivery = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/confirm-delivery/${id}`);
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};

// ===== AMBOS: Cancela orden =====
export const cancelOrder = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/cancel/${id}`);
      return response.data;
   } catch (error) {
      throw new Error((error as Error).message);
   }
};