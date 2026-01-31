import { View, Text } from "react-native";
import { Order } from "../../types";

type Props = {
    order: Order;
};

export function OrderNotes({ order }: Props): JSX.Element {
    return (
        <View className="flex flex-col space-y-1 p-4 border-b-2 border-b-light/25">
            <Text className="text-sm text-dark font-semibold">
                Notas del Pedido
            </Text>
            <Text className="text-text">{order?.notes || "Sin notas"}</Text>
        </View>
    );
}