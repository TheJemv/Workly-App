import { View, Text } from "react-native";
import { Order } from "../../types";

type Props = {
    order: Order;
};

export function OrderHeader({ order }: Props) {
    return (
        <View className="p-4 border-b-2 border-b-light/25">
            <Text numberOfLines={1} className="text-sm text-dark font-semibold">
                Order#: {order.id}
            </Text>
        </View>
    );
}