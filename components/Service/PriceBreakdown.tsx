import React from "react";
import { View, Text } from "react-native";
import { Colors } from "lib";
import type { ServicePricing, ServicePricingInterval } from "@/types/Service";
import { formatMXN, pluralizeUnit, type MerchandiseSubtotal } from "utils/pricing";

type Props =
    | { variant: "full"; pricing: ServicePricing }
    | { variant: "preview"; subtotal: MerchandiseSubtotal };

type ExtraLine = {
    key: string;
    name: string;
    extraUnits: number;
    /** Si el cargo se repite por cada intervalo elegido. */
    perInterval?: boolean;
    /** Monto antes de multiplicar por intervalos (== `amount` si no `perInterval`). */
    amountPerInterval: number;
    amount: number;
};

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
    let intervalLine: ServicePricingInterval | null;
    let includedText: string;
    let extraLines: ExtraLine[];
    let merchandiseTotal: number;

    if (props.variant === "preview") {
        const { subtotal } = props;
        baseAmount = subtotal.baseAmount;
        intervalLine = subtotal.intervalLine
            ? {
                  unitLabel: subtotal.intervalLine.interval.unitLabel,
                  unitHours: subtotal.intervalLine.interval.unitHours,
                  quantity: subtotal.intervalLine.quantity,
                  unitAmount: subtotal.intervalLine.unitAmount,
                  amount: subtotal.intervalLine.amount,
              }
            : null;
        includedText = subtotal.lines
            .map((l) => `${l.addon.minQuantity} ${pluralizeUnit(l.addon.unitLabel, l.addon.minQuantity)}`)
            .join(" · ");
        extraLines = subtotal.lines
            .filter((l) => l.extraUnits > 0)
            .map((l) => ({
                key: l.addon.id,
                name: l.addon.name,
                extraUnits: l.extraUnits,
                perInterval: l.addon.perInterval,
                amountPerInterval: l.amountPerInterval,
                amount: l.amount,
            }));
        merchandiseTotal = subtotal.totalAmount;
    } else {
        const { pricing } = props;
        baseAmount = pricing.baseAmount;
        intervalLine = pricing.interval;
        includedText = pricing.addons
            .map((l) => `${l.minQuantity} ${pluralizeUnit(l.unitLabel, l.minQuantity)}`)
            .join(" · ");
        extraLines = pricing.addons
            .filter((l) => l.extraUnits > 0)
            .map((l) => ({
                key: l.addonId,
                name: l.name,
                extraUnits: l.extraUnits,
                perInterval: l.perInterval,
                amountPerInterval: l.amountPerInterval,
                amount: l.amount,
            }));
        merchandiseTotal = pricing.totalAmount;
    }

    const hasExtras = extraLines.length > 0;

    return (
        <View className="px-4 py-3.5" style={{ gap: 10 }}>
            {/* Precio base (o intervalo, ej. "2 noches × $1,000.00") + qué incluye */}
            <View style={{ gap: 2 }}>
                {intervalLine ? (
                    <Line
                        label={`${intervalLine.quantity} ${pluralizeUnit(intervalLine.unitLabel, intervalLine.quantity)} × ${formatMXN(intervalLine.unitAmount)}`}
                        value={formatMXN(intervalLine.amount)}
                    />
                ) : (
                    <Line label="Precio base" value={formatMXN(baseAmount)} />
                )}
                {includedText ? (
                    <Text className="text-xs" style={{ color: "#717171" }}>
                        Incluye {includedText}
                    </Text>
                ) : null}
            </View>

            {/* Adicionales — si el cargo se repite por intervalo, muestra "$X × N noches" */}
            {extraLines.map((l) => {
                const showInterval = l.perInterval && intervalLine;
                const label = showInterval
                    ? `${l.name} · ${l.extraUnits} adicional${l.extraUnits > 1 ? "es" : ""} · ${formatMXN(l.amountPerInterval)} × ${intervalLine!.quantity} ${pluralizeUnit(intervalLine!.unitLabel, intervalLine!.quantity)}`
                    : `${l.name} · ${l.extraUnits} adicional${l.extraUnits > 1 ? "es" : ""}`;
                return <Line key={l.key} label={label} value={`+${formatMXN(l.amount)}`} />;
            })}

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
