import React from "react";
import { View, Text } from "react-native";
import { Colors } from "lib";
import type { ServicePricing } from "@/types/Service";
import { formatMXN, pluralizeUnit, type MerchandiseSubtotal } from "utils/pricing";

type Props =
    | { variant: "full"; pricing: ServicePricing }
    | { variant: "preview"; subtotal: MerchandiseSubtotal };

type ExtraLine = { key: string; name: string; extraUnits: number; amount: number };

/**
 * Desglose de precio.
 *  - `preview`: subtotal de mercancía (pantalla de configuración, sin comisión).
 *  - `full`: `pricing` del backend (pantalla de pago y detalle de orden).
 *
 * Estructura: precio base (+ qué incluye) → una línea por cada adicional →
 * subtotal → comisión → total.
 */
export default function PriceBreakdown(props: Props) {
    let baseAmount: number;
    let includedText: string;
    let extraLines: ExtraLine[];
    let merchandiseTotal: number;

    if (props.variant === "preview") {
        const { subtotal } = props;
        baseAmount = subtotal.baseAmount;
        includedText = subtotal.lines
            .map((l) => `${l.addon.minQuantity} ${pluralizeUnit(l.addon.unitLabel, l.addon.minQuantity)}`)
            .join(" · ");
        extraLines = subtotal.lines
            .filter((l) => l.extraUnits > 0)
            .map((l) => ({ key: l.addon.id, name: l.addon.name, extraUnits: l.extraUnits, amount: l.amount }));
        merchandiseTotal = subtotal.totalAmount;
    } else {
        const { pricing } = props;
        baseAmount = pricing.baseAmount;
        includedText = pricing.addons
            .map((l) => `${l.minQuantity} ${pluralizeUnit(l.unitLabel, l.minQuantity)}`)
            .join(" · ");
        extraLines = pricing.addons
            .filter((l) => l.extraUnits > 0)
            .map((l) => ({ key: l.addonId, name: l.name, extraUnits: l.extraUnits, amount: l.amount }));
        merchandiseTotal = pricing.totalAmount;
    }

    const hasExtras = extraLines.length > 0;

    return (
        <View className="px-4 py-3.5" style={{ gap: 10 }}>
            {/* Precio base + qué incluye */}
            <View style={{ gap: 2 }}>
                <Line label="Precio base" value={formatMXN(baseAmount)} />
                {includedText ? (
                    <Text className="text-xs" style={{ color: "#717171" }}>
                        Incluye {includedText}
                    </Text>
                ) : null}
            </View>

            {/* Adicionales */}
            {extraLines.map((l) => (
                <Line
                    key={l.key}
                    label={`${l.name} · ${l.extraUnits} adicional${l.extraUnits > 1 ? "es" : ""}`}
                    value={`+${formatMXN(l.amount)}`}
                />
            ))}

            {props.variant === "full" ? (
                <>
                    {hasExtras && (
                        <>
                            <Divider />
                            <Line label="Subtotal" value={formatMXN(merchandiseTotal)} />
                        </>
                    )}
                    <Line label="Comisión de servicio" value={`+${formatMXN(props.pricing.platformFee)}`} muted />
                    <Divider />
                    <Line label="Total a pagar" value={formatMXN(props.pricing.clientTotal)} total />
                </>
            ) : (
                <>
                    <Divider />
                    <Line label="Subtotal" value={formatMXN(merchandiseTotal)} strong />
                    <Text className="text-xs" style={{ color: "#717171" }}>
                        La comisión de servicio se calcula en el siguiente paso.
                    </Text>
                </>
            )}
        </View>
    );
}

function Line({
    label,
    value,
    strong,
    total,
    muted,
}: {
    label: string;
    value: string;
    strong?: boolean;
    total?: boolean;
    muted?: boolean;
}) {
    return (
        <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
            <Text
                className={`flex-1 ${total ? "text-base font-bold" : "text-sm"}`}
                style={{ color: total ? "#040404" : muted ? "#717171" : "#444444" }}
            >
                {label}
            </Text>
            <Text
                className={total ? "text-base font-bold" : strong ? "text-sm font-bold" : "text-sm font-semibold"}
                style={{ color: total ? Colors.principal.DEFAULT : muted ? "#717171" : "#040404" }}
            >
                {value}
            </Text>
        </View>
    );
}

function Divider() {
    return <View className="h-[1px] my-0.5" style={{ backgroundColor: "#eaeaea" }} />;
}
