import { View, ViewProps } from "react-native";
import React from "react";

export type ContainerProps = ViewProps & {
    className?: string;
    children: React.ReactNode;
};

/**
 * Wrapper genérico para agrupar un <CardInfo /> (título) + <CardContent /> (card).
 * No trae padding, margin ni gap por defecto — todo se controla con className/style
 * para poder reusarlo en cualquier pantalla sin pelear contra estilos heredados.
 *
 * @example
 * <Container className="px-4 mb-4" style={{ rowGap: 8 }}>
 *   <CardInfo title="Métodos de Pago" icon="credit-card" />
 *   <CardContent>...</CardContent>
 * </Container>
 */
export default function Container({ className = "", children, style, ...rest }: ContainerProps) {
    return (
        <View className={className} style={style} {...rest}>
            {children}
        </View>
    );
}