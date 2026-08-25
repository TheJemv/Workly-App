import { View, Text, TouchableWithoutFeedback } from "react-native";
import type { JSX } from "react";
import { Order } from "@/types/Order";
import OrderStatusEnum from "enum/OrderStatusEnum";
import SpinLoading from "components/SpinLoading";

type Props = {
    order: Order;
    loadingCancel: boolean;
    onApproveDate: () => void;
    onRejectDate: () => void;
    onCancel: () => void;
};

export function CustomerActions({
    order,
    loadingCancel,
    onApproveDate,
    onRejectDate,
    onCancel,
}: Props): JSX.Element {
    // PENDING: Solo puede cancelar
    if (order.status === OrderStatusEnum.PENDING) {
        return (
            <View className="p-2 w-full">
                <View className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-2">
                    <Text className="text-sm text-yellow-800 text-center">
                        ⏳ Esperando confirmación de la empresa
                    </Text>
                </View>

                <TouchableWithoutFeedback
                    onPress={onCancel}
                    disabled={loadingCancel}
                >
                    <View className="bg-red-500 py-2 rounded-md flex flex-row items-center justify-center">
                        {loadingCancel ? (
                            <SpinLoading color="white" size={22} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Cancelar Pedido
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    // DATE_MODIFIED: Debe aprobar o rechazar
    if (order.status === OrderStatusEnum.DATE_MODIFIED) {
        return (
            <View className="p-2 w-full" style={{ gap: 8 }}>
                <View className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                    <Text className="text-sm text-blue-800 text-center font-semibold">
                        La empresa propuso una nueva fecha de entrega
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

                <TouchableWithoutFeedback
                    onPress={onCancel}
                    disabled={loadingCancel}
                >
                    <View className="bg-red-500 py-2 rounded-md flex flex-row items-center justify-center">
                        {loadingCancel ? (
                            <SpinLoading color="white" size={22} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Cancelar Pedido
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    // CONFIRMED: Esperando entrega, solo puede cancelar
    if (order.status === OrderStatusEnum.CONFIRMED) {
        return (
            <View className="p-2 w-full">
                <View className="bg-green-50 border border-green-200 p-3 rounded-md mb-2">
                    <Text className="text-sm text-green-800 text-center">
                        ✓ Pedido confirmado. Esperando entrega...
                    </Text>
                </View>

                <TouchableWithoutFeedback
                    onPress={onCancel}
                    disabled={loadingCancel}
                >
                    <View className="bg-red-500 py-2 rounded-md flex flex-row items-center justify-center">
                        {loadingCancel ? (
                            <SpinLoading color="white" size={22} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Cancelar Pedido
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    // DELIVERED o CANCELLED: No hay acciones
    return null;
}