import apiClient from "./apiClient";
import { parseApiError } from "./errors";
import type { Order } from "@/types/Order";

export const getOrder = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/${id}`);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
}

// Lista de órdenes del cliente (REST). Se usa para el polling post-pago:
// tras pagar, se busca aquí la orden por `paymentIntent`.
export const listOrders = async (): Promise<Order[]> => {
   try {
      const response = await apiClient.get("/orders");
      return Array.isArray(response.data?.data) ? response.data.data : [];
   } catch (error) {
      throw parseApiError(error);
   }
};


// Orders
// ===== EMPRESA: Acepta orden sin cambios =====
export const acceptOrder = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/accept-order/${id}`);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
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
      throw parseApiError(error);
   }
};

// ===== CLIENTE: Aprueba cambio de fecha =====
export const approveDateChange = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/approve-date-change/${id}`);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

// ===== CLIENTE: Rechaza cambio de fecha =====
export const rejectDateChange = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/reject-date-change/${id}`);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

// ===== EMPRESA: Confirma entrega (después de 45 min) =====
export const confirmDelivery = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/confirm-delivery/${id}`);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

// ===== AMBOS: Cancela orden =====
export const cancelOrder = async (id: string) => {
   try {
      const response = await apiClient.post(`/orders/cancel-order/${id}`);
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
};

// Historial de Ordenes
export const ordersHistory = async (page: number = 1, limit: number = 10) => {
   try {
      const response = await apiClient.get("/orders/history", {
         params: { page, limit }
      });
      return response.data;
   } catch (error) {
      throw parseApiError(error);
   }
}
