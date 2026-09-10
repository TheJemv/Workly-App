import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { Colors } from "lib";
import type { ServiceData } from "@/types/Service/EditService.types";
import AddonForm from "./AddonForm";

const MAX_ADDONS = 15;

type Props = { control: Control<ServiceData> };

/**
 * Sección "Complementos" del form de servicio. Solo se muestra para servicios de
 * precio fijo. `useFieldArray` con `keyName: "_key"` para NO pisar el `id` (`adn_…`)
 * que traen los addons existentes al editar.
 */
export default function AddonListEditor({ control }: Props) {
    const indefinite = useWatch({ control, name: "indefinite" });
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "addons",
        keyName: "_key",
    });

    // Un servicio "a convenir" no lleva complementos.
    useEffect(() => {
        if (indefinite && fields.length > 0) replace([]);
    }, [indefinite]); // eslint-disable-line react-hooks/exhaustive-deps

    if (indefinite) return null;

    const addAddon = () => {
        if (fields.length >= MAX_ADDONS) return;
        append({
            type: "PER_UNIT",
            name: "",
            unitLabel: "",
            description: "",
            minQuantity: 1,
            maxQuantity: 10,
            step: 1,
            pricePerExtraUnit: 15000,
        } as any);
    };

    return (
        <View style={{ gap: 12, marginBottom: 16 }}>
            <View className="flex-row items-center justify-between">
                <Text style={{ color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: "700" }}>
                    Complementos
                </Text>
                <Text className="text-xs text-text-light">{fields.length}/{MAX_ADDONS}</Text>
            </View>

            <Text className="text-xs text-text-light">
                Opciones que ajustan el precio (ej. "Personas": el precio base cubre 40, cada
                persona extra cuesta más).
            </Text>

            {fields.map((field, index) => (
                <AddonForm key={field._key} control={control} index={index} onRemove={() => remove(index)} />
            ))}

            {fields.length < MAX_ADDONS && (
                <TouchableOpacity
                    onPress={addAddon}
                    className="flex-row items-center justify-center py-3 rounded-lg"
                    style={{ backgroundColor: Colors.principal[100], gap: 8 }}
                >
                    <Feather name="plus-circle" size={18} color={Colors.principal.DEFAULT} />
                    <Text className="font-semibold" style={{ color: Colors.principal.DEFAULT }}>
                        Agregar complemento
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
