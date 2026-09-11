import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "lib";
import type { ServiceInterval } from "@/types/Service";
import { formatMXN, pluralizeUnit, snapIntervalQuantity } from "utils/pricing";

type Props = {
    interval: ServiceInterval;
    /** Precio de 1 intervalo (`service.unit_amount`). */
    unitAmount: number;
    quantity: number;
    onChange: (quantity: number) => void;
};

/**
 * Selector de cantidad para servicios con precio "por intervalo" (ej. $/noche).
 * Va dentro de un <CardContent>, igual que `AddonStepper`.
 */
export default function IntervalStepper({ interval, unitAmount, quantity, onChange }: Props) {
    const value = snapIntervalQuantity(interval, quantity);
    const amount = value * unitAmount;

    const atMin = value <= interval.minQuantity;
    const atMax = value >= interval.maxQuantity;

    const dec = () => !atMin && onChange(snapIntervalQuantity(interval, value - interval.step));
    const inc = () => !atMax && onChange(snapIntervalQuantity(interval, value + interval.step));

    return (
        <View className="px-4 py-3.5" style={{ gap: 10 }}>
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-bold" style={{ color: "#040404" }}>
                    ¿Cuántas {pluralizeUnit(interval.unitLabel, 2)}?
                </Text>
                <Text className="text-sm font-bold" style={{ color: Colors.principal.DEFAULT }}>
                    {formatMXN(amount)}
                </Text>
            </View>

            <View className="flex-row items-center justify-between">
                <StepButton icon="minus" disabled={atMin} onPress={dec} />
                <View className="items-center" style={{ minWidth: 72 }}>
                    <Text className="text-lg font-bold" style={{ color: "#040404" }}>
                        {value}
                    </Text>
                    <Text className="text-[11px]" style={{ color: "#717171" }}>
                        {interval.unitLabel}
                    </Text>
                </View>
                <StepButton icon="plus" disabled={atMax} onPress={inc} />
            </View>

            <Text className="text-xs" style={{ color: "#717171" }}>
                {formatMXN(unitAmount)} por {interval.unitLabel}
                {"  ·  "}Mín. {interval.minQuantity}
                {"  ·  "}Máx. {interval.maxQuantity}
            </Text>
        </View>
    );
}

function StepButton({
    icon,
    disabled,
    onPress,
}: {
    icon: "minus" | "plus";
    disabled: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            className="items-center justify-center rounded-full border"
            style={{
                width: 40,
                height: 40,
                borderColor: Colors.principal.DEFAULT,
                opacity: disabled ? 0.35 : 1,
            }}
        >
            <Feather name={icon} size={18} color={Colors.principal.DEFAULT} />
        </TouchableOpacity>
    );
}
