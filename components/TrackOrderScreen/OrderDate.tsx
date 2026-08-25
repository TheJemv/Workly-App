import { View, Text, TouchableOpacity } from "react-native";
import type { JSX } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "lib";
import { Order } from "@/types/Order";
import OrderStatusEnum from "enum/OrderStatusEnum";
import formatDateService from "functions/formatDateService";

type Props = {
    order: Order;
    isCompany: boolean;
    onEditPress: () => void;
};

export function OrderDate({ order, isCompany, onEditPress }: Props): JSX.Element {
    const canEdit = isCompany && order.status === OrderStatusEnum.PENDING;

    return (
        <View className="flex flex-col space-y-1 p-4 border-b-2 border-b-light/25">
            <View className="flex flex-row justify-between items-center">
                <Text className="text-sm text-dark font-semibold">
                    Fecha de Entrega
                </Text>

                {canEdit && (
                    <TouchableOpacity onPress={onEditPress}>
                        <MaterialIcons
                            name="edit"
                            size={20}
                            color={Colors.principal.DEFAULT}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <Text className="text-text">
                {formatDateService(new Date(order?.dateRequest))}
            </Text>

            {/* Mostrar fecha original si fue modificada */}
            {order.originalDeliveryDate && (
                <View className="mt-2 bg-blue-50 p-2 rounded-md">
                    <Text className="text-xs text-blue-600 font-semibold">
                        Fecha Original:
                    </Text>
                    <Text className="text-xs text-blue-800 line-through">
                        {formatDateService(new Date(order.originalDeliveryDate))}
                    </Text>
                </View>
            )}

            {/* Mensaje si está esperando aprobación */}
            {order.status === OrderStatusEnum.DATE_MODIFIED && (
                <View className="mt-2 bg-yellow-50 p-2 rounded-md">
                    <Text className="text-xs text-yellow-800">
                        {isCompany
                            ? "⏳ Esperando aprobación del cliente"
                            : "⏳ La empresa propuso una nueva fecha. Por favor revisa y aprueba o rechaza."
                        }
                    </Text>
                </View>
            )}
        </View>
    );
}