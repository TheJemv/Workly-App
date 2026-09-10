import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { MoneyTextInput } from "@alexzunik/react-native-money-input";
import { TextInput } from "components/Profile/Billing/components/text-input";
import { Colors } from "lib";
import type { ServiceData } from "@/types/Service/EditService.types";

type Props = {
    control: Control<ServiceData>;
    index: number;
    onRemove: () => void;
};

/** Editor de un complemento PER_UNIT dentro del form de servicio (crear / editar). */
export default function AddonForm({ control, index, onRemove }: Props) {
    const base = `addons.${index}` as const;

    return (
        <View style={styles.card}>
            <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm font-bold" style={{ color: Colors.principal.DEFAULT }}>
                    Complemento {index + 1}
                </Text>
                <TouchableOpacity onPress={onRemove} hitSlop={8} className="flex-row items-center" style={{ gap: 4 }}>
                    <Feather name="trash-2" size={15} color="#e53e3e" />
                    <Text className="text-xs" style={{ color: "#e53e3e" }}>Quitar</Text>
                </TouchableOpacity>
            </View>

            <Controller
                control={control}
                name={`${base}.name` as const}
                render={({ field, fieldState }) => (
                    <TextInput
                        label="Nombre"
                        placeholder="Ej. Personas"
                        value={field.value as string}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        maxLength={60}
                    />
                )}
            />

            <Controller
                control={control}
                name={`${base}.unitLabel` as const}
                render={({ field, fieldState }) => (
                    <TextInput
                        label="Unidad (en minúscula)"
                        placeholder="Ej. personas"
                        value={field.value as string}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        maxLength={30}
                    />
                )}
            />

            <Controller
                control={control}
                name={`${base}.description` as const}
                render={({ field, fieldState }) => (
                    <TextInput
                        label="Descripción (opcional)"
                        placeholder="Qué incluye y el costo por unidad extra"
                        value={(field.value as string) ?? ""}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        multiline
                        maxLength={200}
                    />
                )}
            />

            <View className="flex-row" style={{ gap: 10 }}>
                <View className="flex-1">
                    <NumberField control={control} name={`${base}.minQuantity`} label="Incluidas" />
                </View>
                <View className="flex-1">
                    <NumberField control={control} name={`${base}.maxQuantity`} label="Máximo" />
                </View>
                <View className="flex-1">
                    <NumberField control={control} name={`${base}.step`} label="Incremento" />
                </View>
            </View>

            <Controller
                control={control}
                name={`${base}.pricePerExtraUnit` as const}
                render={({ field, fieldState }) => (
                    <View className="flex flex-col" style={{ gap: 4 }}>
                        <Text style={styles.label}>Precio por unidad extra</Text>
                        <MoneyTextInput
                            className="py-2 px-2 rounded-lg border border-dark/10"
                            value={((Number(field.value) || 0) / 100).toString()}
                            onChangeText={(_f, extracted) => field.onChange(Math.round(Number(extracted) * 100))}
                            style={styles.money}
                            prefix="$"
                            groupingSeparator=","
                            fractionSeparator="."
                            placeholderTextColor="#92929D"
                            placeholder="$150.00"
                        />
                        {fieldState.error && (
                            <Text className="text-sm text-red-500 font-medium">{fieldState.error.message}</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

function NumberField({
    control,
    name,
    label,
}: {
    control: Control<ServiceData>;
    name: string;
    label: string;
}) {
    return (
        <Controller
            control={control}
            name={name as any}
            render={({ field, fieldState }) => (
                <TextInput
                    label={label}
                    placeholder="0"
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

const styles = StyleSheet.create({
    card: {
        gap: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: "#eaeaea",
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    label: { color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: "700" },
    money: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "#04040420" },
});
