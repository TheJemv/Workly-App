import React, { useEffect } from "react";
import { View } from "react-native";
import { Control, Controller, useWatch } from "react-hook-form";
import { TextInput } from "components/Profile/Billing/components/text-input";
import type { ServiceData } from "@/types/Service/EditService.types";
import SegmentedField from "./SegmentedField";

const DEFAULT_INTERVAL = {
    unitLabel: "",
    unitHours: 24,
    minQuantity: 1,
    maxQuantity: 30,
    step: 1,
};

type Props = {
    control: Control<ServiceData>;
    setValue: (name: "interval", value: ServiceData["interval"], options?: { shouldDirty?: boolean }) => void;
};

/**
 * Sección "Precio por intervalo" del form de servicio (ej. $/noche, $/hora).
 * Solo aplica a servicios de precio fijo — un servicio "a convenir" no puede
 * tener `interval` (el backend lo rechaza).
 */
export default function IntervalFields({ control, setValue }: Props) {
    const indefinite = useWatch({ control, name: "indefinite" });
    const interval = useWatch({ control, name: "interval" });
    const enabled = interval != null;

    // Un servicio "a convenir" no lleva precio por intervalo.
    useEffect(() => {
        if (indefinite && enabled) setValue("interval", null, { shouldDirty: true });
    }, [indefinite]); // eslint-disable-line react-hooks/exhaustive-deps

    if (indefinite) return null;

    return (
        <View style={{ gap: 12 }}>
            <SegmentedField
                label="¿Se cobra por intervalo? (ej. $/noche, $/hora)"
                value={enabled ? "si" : "no"}
                onChange={(v) => setValue("interval", v === "si" ? DEFAULT_INTERVAL : null, { shouldDirty: true })}
                options={[
                    { label: "No", value: "no" },
                    { label: "Sí", value: "si" },
                ]}
                caption={
                    enabled
                        ? "El monto de arriba es el precio de 1 unidad; el cliente elige cuántas."
                        : "El monto de arriba es el precio total del servicio."
                }
            />

            {enabled && (
                <View style={{ gap: 10 }}>
                    <Controller
                        control={control}
                        name="interval.unitLabel"
                        render={({ field, fieldState }) => (
                            <TextInput
                                label="Nombre de la unidad (en minúscula)"
                                placeholder="Ej. noche"
                                value={(field.value as string) ?? ""}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                maxLength={30}
                            />
                        )}
                    />

                    <NumberField
                        control={control}
                        name="interval.unitHours"
                        label="Duración de 1 unidad (horas)"
                        placeholder="Ej. 24 (una noche)"
                    />

                    <View className="flex-row" style={{ gap: 10 }}>
                        <View className="flex-1">
                            <NumberField control={control} name="interval.minQuantity" label="Mínimo" />
                        </View>
                        <View className="flex-1">
                            <NumberField control={control} name="interval.maxQuantity" label="Máximo" />
                        </View>
                        <View className="flex-1">
                            <NumberField control={control} name="interval.step" label="Incremento" />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

function NumberField({
    control,
    name,
    label,
    placeholder = "0",
}: {
    control: Control<ServiceData>;
    name: string;
    label: string;
    placeholder?: string;
}) {
    return (
        <Controller
            control={control}
            name={name as any}
            render={({ field, fieldState }) => (
                <TextInput
                    label={label}
                    placeholder={placeholder}
                    keyboardType="number-pad"
                    value={field.value != null ? String(field.value) : ""}
                    onChange={(t) => {
                        const n = parseInt(String(t).replace(/[^0-9]/g, ""), 10);
                        field.onChange(Number.isNaN(n) ? undefined : n);
                    }}
                    error={fieldState.error?.message}
                    maxLength={7}
                />
            )}
        />
    );
}
