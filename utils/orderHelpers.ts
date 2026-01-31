import { Order } from "../../types";
import OrderStatusEnum from "enum/OrderStatusEnum";

export function getOrderFromState(
    paramOrder: Order,
    orders: any,
    sales: any
): Order {
    if (orders?.data?.find((o: Order) => o.id === paramOrder.id)) {
        return orders.data.find((o: Order) => o.id === paramOrder.id);
    } else if (sales?.data?.find((o: Order) => o.id === paramOrder.id)) {
        return sales.data.find((o: Order) => o.id === paramOrder.id);
    }
    return paramOrder;
}
export function canConfirmDelivery(deliveryDate: string): boolean {
    const deliveryTime = new Date(deliveryDate);
    const now = new Date();
    const minConfirmTime = new Date(deliveryTime.getTime() + 45 * 60 * 1000);
    return now >= minConfirmTime;
}
export function getTrackingSteps(status: OrderStatusEnum) {
    const steps = [
        {
            icon: "file-text",
            title: "Pedido Realizado",
            description: "El pedido ha sido creado",
            active: [
                OrderStatusEnum.PENDING,
                OrderStatusEnum.DATE_MODIFIED,
                OrderStatusEnum.CONFIRMED,
                OrderStatusEnum.DELIVERED,
                OrderStatusEnum.CANCELLED,
            ].includes(status),
        },
        {
            icon: "clock-o",
            title: "Esperando Confirmación",
            description:
                status === OrderStatusEnum.PENDING
                    ? "Empresa revisando pedido"
                    : status === OrderStatusEnum.DATE_MODIFIED
                        ? "Cliente revisando nueva fecha"
                        : "Confirmado",
            active: [
                OrderStatusEnum.PENDING,
                OrderStatusEnum.DATE_MODIFIED,
                OrderStatusEnum.CONFIRMED,
                OrderStatusEnum.DELIVERED,
            ].includes(status),
        },
        {
            icon: "check-circle",
            title: "Pedido Confirmado",
            description: "Ambas partes están de acuerdo",
            active: [
                OrderStatusEnum.CONFIRMED,
                OrderStatusEnum.DELIVERED,
            ].includes(status),
        },
    ];
    // Agregar paso final según el estado
    if (status === OrderStatusEnum.CANCELLED) {
        steps.push({
            icon: "times-circle",
            title: "Pedido Cancelado",
            description: "El pedido ha sido cancelado",
            active: true,
        });
    } else {
        steps.push({
            icon: "check",
            title: "Pedido Entregado",
            description: "El pedido ha sido completado",
            active: status === OrderStatusEnum.DELIVERED,
        });
    }
    return steps;
}