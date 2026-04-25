import { View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { Order } from "@/types/Order";
import { StepTrack } from "components/TrackOrderScreen/step-track";
import { getTrackingSteps } from "utils/orderHelpers";
import OrderStatusEnum from "enum/OrderStatusEnum";

type Props = {
    order: Order;
};

export function OrderTracking({ order }: Props) {
    const steps = getTrackingSteps(order.status);
    const isCancelled = order.status === OrderStatusEnum.CANCELLED;

    return (
        <View className="flex flex-col space-y-6 p-4">
            <View className="flex flex-row items-center justify-between space-x-3">
                <Text className={`text-sm font-semibold ${isCancelled ? "text-red-500" : "text-dark"}`}>
                    {isCancelled ? "Orden Cancelada" : "Seguimiento de Orden"}
                </Text>
                <FontAwesome
                    name="chevron-up"
                    size={16}
                    color={isCancelled ? Colors.red : Colors.principal.DEFAULT}
                />
            </View>

            <View className="flex flex-col -space-y-0.5">
                {steps.map((step, index) => (
                    <StepTrack
                        key={index}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                        completed={step.completed}
                        current={step.current}
                        cancelled={step.cancelled}
                    />
                ))}
            </View>
        </View>
    );
}