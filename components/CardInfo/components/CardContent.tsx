import { View } from "react-native";
import React from "react";
import { cardShadow } from "./../utils/styles";

export type CardContentProps = {
    children: React.ReactNode;
    className?: string;
    /** Agrega una línea divisoria entre cada hijo directo. Default: true */
    divided?: boolean;
    /** Margen izquierdo del divisor, para simular el "inset divider" estilo iOS. Default: 52 */
    dividerInset?: number;
};

/**
 * La card blanca con borde, esquinas redondeadas y sombra que funciona igual
 * en iOS y Android (Android necesita elevation, no shadow-*).
 * Si recibe varios hijos (ej. varios <Row />), agrega separadores automáticamente.
 *
 * @example
 * <CardContent>
 *   <Row icon="credit-card" label="Cobros" value="Activo" tone="success" />
 *   <Row icon="credit-card" label="Depósitos" value="Activo" tone="success" />
 * </CardContent>
 */
export default function CardContent({
    children,
    className = "",
    divided = true,
    dividerInset = 0,
}: CardContentProps) {
    const items = React.Children.toArray(children);

    return (
        <View className="rounded-xl bg-white" style={cardShadow}>
            <View className={`rounded-xl overflow-hidden border border-border-soft ${className}`}>
                {items.map((child, index) => (
                    <View key={index}>
                        {child}
                        {divided && index < items.length - 1 && (
                            <View
                                className="h-[1px] bg-border-soft"
                                style={{ marginLeft: dividerInset }}
                            />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}