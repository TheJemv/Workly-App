import { View, Text } from "react-native";
import { Order } from "@/types/Order";
import ServiceGallery from "components/Service/ServiceGallery";
import { orderGallery } from "utils/serviceGallery";

type Props = {
    order: Order;
};

export function OrderHeader({ order }: Props) {
    // Snapshot de la galería del servicio al momento de comprar (1 a 5 fotos).
    const gallery = orderGallery(order);

    return (
        <View className="p-4 border-b-2 border-b-light/25" style={{ gap: 12 }}>
            {gallery.length > 0 && (
                <ServiceGallery photos={gallery} horizontalPadding={56} />
            )}

            <Text numberOfLines={1} className="text-sm text-dark font-semibold">
                Order#: {order.id}
            </Text>
        </View>
    );
}
