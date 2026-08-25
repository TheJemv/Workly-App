import { View, Text } from "react-native";
import { Image } from "expo-image";

import { Order } from "@/types/Order";

type Props = {
    order: Order;
};

export function OrderDetails({ order }: Props) {
    return (
        <View className="flex flex-col space-y-5 p-4 border-b-2 border-b-light/25">
            <View className="flex flex-row items-start justify-between space-x-4">
                <View className="flex flex-1 flex-col space-y-1">
                    <Text className="text-base text-dark font-bold">
                        {order?.serviceName}
                    </Text>
                    <Text
                        className="text-sm text-text font-medium"
                        numberOfLines={3}
                    >
                        {order?.serviceDescription}
                    </Text>
                </View>
                <Image
                    source={{ uri: order.servicePhoto }}
                    className="w-20 h-20 rounded-xl bg-light/25"
                />
            </View>
        </View>
    );
}