import { Order } from "@/types/Order";
import OrderStatusEnum from "enum/OrderStatusEnum";

export function getOrderFromState(
    paramOrder: any, // params de expo-router
    orders: any,
    sales: any
): Order | undefined {
    const id = paramOrder?.orderId ?? paramOrder?.id  // ✅ soporta ambos

    if (orders?.data?.find((o: Order) => o.id === id)) {
        return orders.data.find((o: Order) => o.id === id);
    } else if (sales?.data?.find((o: Order) => o.id === id)) {
        return sales.data.find((o: Order) => o.id === id);
    }
    // OJO: nunca devolver `paramOrder` tal cual. expo-router serializa cada
    // param a string, así que los campos anidados (pricing, servicePhotos,
    // location…) llegan rotos (ej. "[object Object]") — por eso "Total a
    // pagar" salía en $0 y las fotos no se veían al entrar desde Historial
    // (esa lista vive en estado local, no en `orders`/`sales`, así que nunca
    // se encontraba ahí y siempre caía en este fallback). Si no está en el
    // store global, hay que dejar que `order.tsx` la pida completa a la API.
    return undefined;
}
export function canConfirmDelivery(deliveryDate: string): boolean {
    const deliveryTime = new Date(deliveryDate);
    const now = new Date();
    const minConfirmTime = new Date(deliveryTime.getTime() + 45 * 60 * 1000);
    return now >= minConfirmTime;
}
// Icons que StepTrack acepta (ver components/TrackOrderScreen/step-track.tsx).
// Se anota el arreglo con este tipo para que el .push() de abajo no choque con
// el tipo más angosto que TS infiere de los primeros 3 elementos literales.
type StepIcon = "file-text" | "credit-card" | "check" | "dropbox" | "bus" | "times" | "clock-o" | "check-circle" | "times-circle";

// Order.status es `string | OrderStatusEnum` (a veces llega como string crudo
// del backend antes de compararse contra el enum), así que aceptamos ambos.
export function getTrackingSteps(status: string | OrderStatusEnum) {
    const isCancelled = status === OrderStatusEnum.CANCELLED;

    const steps: { icon: StepIcon; title: string; description: string; completed: boolean; current: boolean; cancelled: boolean }[] = [
        {
            icon: "file-text" as const,
            title: "Pedido Realizado",
            description: "El pedido ha sido creado",
            completed: true,
            current: !isCancelled && status === OrderStatusEnum.PENDING, // 👈 no marcar como current si está cancelado
            cancelled: false,
        },
        {
            icon: "clock-o" as const,
            title: "Esperando Confirmación",
            description:
                status === OrderStatusEnum.PENDING
                    ? "Empresa revisando pedido"
                    : status === OrderStatusEnum.DATE_MODIFIED
                        ? "Cliente revisando nueva fecha"
                        : "Confirmado",
            completed: ([
                OrderStatusEnum.CONFIRMED,
                OrderStatusEnum.DELIVERED,
            ] as (string | OrderStatusEnum)[]).includes(status),
            current: ([OrderStatusEnum.PENDING, OrderStatusEnum.DATE_MODIFIED] as (string | OrderStatusEnum)[]).includes(status),
            cancelled: false,
        },
        {
            icon: "check-circle" as const,
            title: "Pedido Confirmado",
            description: "Ambas partes están de acuerdo",
            completed: status === OrderStatusEnum.DELIVERED,
            current: status === OrderStatusEnum.CONFIRMED,
            cancelled: false,
        },
    ];

    if (isCancelled) {
        return [
            steps[0], // solo "Pedido Realizado"
            {
                icon: "times" as const,
                title: "Pedido Cancelado",
                description: "El pedido ha sido cancelado",
                completed: false,
                current: false,
                cancelled: true,
            }
        ];
    } else {
        steps.push({
            icon: "check" as const,
            title: "Pedido Completado",
            description: "El pedido ha sido completado",
            completed: status === OrderStatusEnum.DELIVERED,
            current: status === OrderStatusEnum.DELIVERED,
            cancelled: false,
        });
    }

    return steps;
}