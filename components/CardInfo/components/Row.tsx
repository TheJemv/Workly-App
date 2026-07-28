import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { IconName, Tone } from "./../utils/types";
import { toneColor } from "./../utils/styles";

export type RowProps = {
    icon?: IconName;
    label: string;
    /** Texto simple (se colorea según tone) o cualquier nodo custom (ej. un switch, un link) */
    value?: React.ReactNode;
    tone?: Tone;
    /** Si se pasa, la fila se vuelve tappable */
    onPress?: () => void;
    /** Elemento extra a la derecha del todo (ej. chevron, switch) */
    rightSlot?: React.ReactNode;
};

/**
 * Una fila dentro de un <CardContent />: ícono + label + valor.
 * Si recibe onPress, se renderiza como TouchableOpacity.
 *
 * @example
 * <Row icon="clock" label="Horarios de atención" value="Editar horarios" onPress={...} />
 */
export default function Row({ icon, label, value, tone = "default", onPress, rightSlot }: RowProps) {
    const Wrapper: any = onPress ? TouchableOpacity : View;

    return (
        <Wrapper
            {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
            className="flex-row items-center gap-3 px-4 py-3.5"
        >
            {icon && (
                <View
                    className={`w-8 h-8 rounded-lg items-center justify-center ${tone === "muted" ? "bg-[#f5f5f5]" : "bg-brand-light"
                        }`}
                >
                    <Feather
                        name={icon}
                        size={16}
                        color={toneColor(tone === "muted" ? "muted" : "default")}
                    />
                </View>
            )}

            <View className="flex-1">
                <Text className="text-sm text-text-default">{label}</Text>
            </View>

            {typeof value === "string" ? (
                <Text className="text-sm font-semibold" style={{ color: toneColor(tone) }}>
                    {value}
                </Text>
            ) : (
                value
            )}

            {rightSlot}
        </Wrapper>
    );
}