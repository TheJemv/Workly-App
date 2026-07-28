import { View, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Colors } from "lib";
import { IconName } from "./types";

export type CardInfoVariant = "label" | "heading";

export type CardInfoProps = {
    title: string;
    icon?: IconName;
    iconColor?: string;
    /**
     * "label" (default): texto chico gris en mayúsculas, usado en settings/onboarding.
     * "heading": ícono + texto bold text-dark, usado para secciones de contenido (ej. ServiceHire).
     */
    variant?: CardInfoVariant;
    className?: string;
};

/**
 * Título de una sección, con ícono opcional a la izquierda.
 * Se coloca arriba de un <CardContent />, dentro del mismo <Container>.
 *
 * @example
 * <CardInfo title="Verificación de la Cuenta" icon="shield" />
 * <CardInfo title="Horarios de la Empresa" icon="clock" variant="heading" />
 */
export default function CardInfo({
    title,
    icon,
    iconColor,
    variant = "label",
    className = "",
}: CardInfoProps) {
    if (variant === "heading") {
        return (
            <View className={`flex-row items-center gap-2 mb-2 px-1 ${className}`}>
                {icon && (
                    <Feather name={icon} size={13} color={iconColor ?? Colors.principal.DEFAULT} />
                )}
                <Text className="text-sm font-bold text-text-dark">{title}</Text>
            </View>
        );
    }

    return (
        <View className={`flex-row items-center gap-1.5 mb-2 px-1 ${className}`}>
            {icon && <Feather name={icon} size={12} color={iconColor ?? "#8A8A8E"} />}
            <Text className="text-xs font-semibold text-text-light uppercase tracking-widest">
                {title}
            </Text>
        </View>
    );
}