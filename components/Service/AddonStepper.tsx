import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "lib";
import type { Addon } from "@/types/Service";
import { computeAddonLine, formatMXN, snapQuantity } from "utils/pricing";

type Props = {
    addon: Addon;
    quantity: number;
    onChange: (quantity: number) => void;
};

/**
 * Selector de un complemento PER_UNIT. Va dentro de un <CardContent> (que agrega
 * los divisores entre cada uno).
 */
export default function AddonStepper({ addon, quantity, onChange }: Props) {
    const value = snapQuantity(addon, quantity);
    const { extraUnits, amount } = computeAddonLine(addon, value);

    const atMin = value <= addon.minQuantity;
    const atMax = value >= addon.maxQuantity;

    const dec = () => !atMin && onChange(snapQuantity(addon, value - addon.step));
    const inc = () => !atMax && onChange(snapQuantity(addon, value + addon.step));

    return (
        <View className="px-4 py-3.5" style={{ gap: 10 }}>
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-bold" style={{ color: "#040404" }}>
                    {addon.name}
                </Text>
                {extraUnits > 0 ? (
                    <Text className="text-sm font-bold" style={{ color: Colors.principal.DEFAULT }}>
                        +{formatMXN(amount)}
                    </Text>
                ) : (
                    <Text className="text-sm font-semibold" style={{ color: "#16a34a" }}>
                        Incluido
                    </Text>
                )}
            </View>

            <View className="flex-row items-center justify-between">
                <StepButton icon="minus" disabled={atMin} onPress={dec} />
                <View className="items-center" style={{ minWidth: 72 }}>
                    <Text className="text-lg font-bold" style={{ color: "#040404" }}>
                        {value}
                    </Text>
                    <Text className="text-[11px]" style={{ color: "#717171" }}>
                        {addon.unitLabel}
                    </Text>
                </View>
                <StepButton icon="plus" disabled={atMax} onPress={inc} />
            </View>

            {addon.description ? (
                <Text className="text-xs" style={{ color: "#717171" }}>
                    {addon.description}
                </Text>
            ) : null}

            <Text className="text-xs" style={{ color: "#717171" }}>
                Incluye {addon.minQuantity} {addon.unitLabel} · +{formatMXN(addon.pricePerExtraUnit)} por {addon.unitLabel} extra
                {"  ·  "}Máx. {addon.maxQuantity}
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
