import { View, Text, TouchableWithoutFeedback } from "react-native";
import type { JSX } from "react";
import { Order } from "@/types/Order";
import OrderStatusEnum from "enum/OrderStatusEnum";

type Props = {
    order: Order;
    onApproveDate: () => void;
    onRejectDate: () => void;
};

// El cliente NO puede cancelar la orden — solo la empresa (ver CompanyActions).
// Aquí solo se muestra estado informativo y, si aplica, aprobar/rechazar la
// nueva fecha propuesta por la empresa.
export function CustomerActions({
    order,
    onApproveDate,
    onRejectDate,
}: Props): JSX.Element {
    // PENDING: solo informativo, sin acciones.
    if (order.status === OrderStatusEnum.PENDING) {
        return (
            <View className="p-2 w-full">
                <View className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                    <Text className="text-sm text-yellow-800 text-center">
                        ⏳ Esperando confirmación de la empresa
                    </Text>
                </View>
            </View>
        );
    }

    // DATE_MODIFIED: debe aprobar o rechazar la nueva fecha.
    if (order.status === OrderStatusEnum.DATE_MODIFIED) {
        return (
            <View className="p-2 w-full" style={{ gap: 8 }}>
                <View className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                    <Text className="text-sm text-blue-800 text-center font-semibold">
                        La empresa propuso una nueva fecha
                    </Text>
                </View>

                <TouchableWithoutFeedback onPress={onApproveDate}>
                    <View className="bg-green-500 py-2 rounded-md flex flex-row items-center justify-center">
                        <Text className="text-white text-base font-semibold">
                            ✓ Aceptar Nueva Fecha
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={onRejectDate}>
                    <View className="bg-orange-500 py-2 rounded-md flex flex-row items-center justify-center">
                        <Text className="text-white text-base font-semibold">
                            ✗ Rechazar Cambio
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    // CONFIRMED: solo informativo, sin acciones.
    if (order.status === OrderStatusEnum.CONFIRMED) {
        return (
            <View className="p-2 w-full">
                <View className="bg-green-50 border border-green-200 p-3 rounded-md">
                    <Text className="text-sm text-green-800 text-center">
                        ✓ Pedido confirmado. Esperando finalización...
                    </Text>
                </View>
            </View>
        );
    }

    // DELIVERED o CANCELLED: No hay acciones
    return null;
}
