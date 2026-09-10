import { View, Text } from "react-native";
import type { JSX } from "react";
import { Order } from "@/types/Order";
import PriceBreakdown from "components/Service/PriceBreakdown";

type Props = {
    order: Order;
};

/** Desglose de precio de la orden (base + complementos + comisión). */
export function OrderPricing({ order }: Props): JSX.Element | null {
    if (!order?.pricing) return null;

    return (
        <View className="flex flex-col p-4 border-b-2 border-b-light/25">
            <Text className="text-sm text-dark font-semibold mb-1">Desglose de pago</Text>
            <PriceBreakdown variant="full" pricing={order.pricing} />
        </View>
    );
}

export default OrderPricing;
