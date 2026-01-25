enum OrderStatusEnum {
   Pending = "Pendiente",
   Processing = "Proceso",
   Completed = "Completada",

   Cancel = "Cancelada",
   Failed = "Fallido",

   // Estados
   PENDING = 'pending',
   DATE_MODIFIED = 'date_modified',
   CONFIRMED = 'confirmed',
   DELIVERED = 'delivered',
   CANCELLED = 'cancelled',
   FAILED = 'failed'
}

export default OrderStatusEnum;
