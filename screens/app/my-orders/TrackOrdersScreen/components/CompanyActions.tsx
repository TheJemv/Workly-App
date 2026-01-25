import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Order } from "../../types";
import OrderStatusEnum from "enum/OrderStatusEnum";
import SpinLoading from "components/SpinLoading";
import { canConfirmDelivery } from "../utils/orderHelpers";

type Props = {
    order: Order;
    loading: boolean;
    loadingCancel: boolean;
    onAccept: () => void;
    onModifyDate: () => void;
    onConfirmDelivery: () => void;
    onCancel: () => void;
};

export function CompanyActions({
    order,
    loading,
    loadingCancel,
    onAccept,
    onModifyDate,
    onConfirmDelivery,
    onCancel,
}: Props): JSX.Element {
    // PENDING: Puede aceptar sin cambios o modificar fecha
    if (order.status === OrderStatusEnum.PENDING) {
        return (
            <View className="flex flex-row p-2 w-full" style={{ gap: 8 }}>
                <TouchableWithoutFeedback onPress={onAccept} disabled={loading}>
                    <View className="bg-green-500 py-2 rounded-md flex flex-row items-center justify-center flex-1">
                        {loading ? (
                            <SpinLoading color="white" size={22} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Aceptar Pedido
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    onPress={onModifyDate}
                    disabled={loading}
                >
                    <View className="bg-blue-500 py-2 rounded-md flex flex-row items-center justify-center flex-1">
                        <Text className="text-white text-base font-semibold">
                            Modificar Fecha
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    // DATE_MODIFIED: Esperando cliente, solo puede cancelar
    if (order.status === OrderStatusEnum.DATE_MODIFIED) {
        return (
            <View className="p-2 w-full">
                <View className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-2">
                    <Text className="text-sm text-yellow-800 text-center">
                        ⏳ Esperando que el cliente apruebe la nueva fecha
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

    // CONFIRMED: Puede confirmar entrega (después de 45 min)
    if (order.status === OrderStatusEnum.CONFIRMED) {
        const deliveryReady = canConfirmDelivery(order.dateRequest);

        return (
            <View className="p-2 w-full" style={{ gap: 8 }}>
                <TouchableWithoutFeedback
                    onPress={onConfirmDelivery}
                    disabled={loading || !deliveryReady}
                >
                    <View
                        className={`py-2 rounded-md flex flex-row items-center justify-center ${deliveryReady ? "bg-purple-500" : "bg-gray-300"
                            }`}
                    >
                        {loading ? (
                            <SpinLoading color="white" size={22} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                {deliveryReady
                                    ? "Confirmar Entrega"
                                    : "Confirmar Entrega (Disponible en 45 min)"}
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                {!deliveryReady && (
                    <Text className="text-xs text-gray-500 text-center">
                        Disponible a partir de las{" "}
                        {new Date(
                            new Date(order.dateRequest).getTime() + 45 * 60 * 1000
                        ).toLocaleTimeString()}
                    </Text>
                )}

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