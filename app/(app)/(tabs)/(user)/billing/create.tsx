import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    Alert,
    TouchableOpacity,
    Platform
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { invoiceDataResolver, Billing, defaultInvoiceData } from "@/types/Billing/Billing";
import { TextInput } from "components/Profile/Billing/components/text-input";
import { postBilling } from "services/api/billing.api";
import useGlobal from "core/globals";
import { router, useNavigation } from "expo-router";
import { Colors } from "lib";
import { useLayoutEffect } from "react";
import { Entypo } from "@expo/vector-icons";

import { RegimeSelect } from "components/Profile/Billing/regime-select";

export default function CreateInvoiceScreen() {
    const navigation = useNavigation()
    const { token } = useGlobal();
    const { control, handleSubmit } = useForm<Billing>({
        resolver: invoiceDataResolver,
        defaultValues: defaultInvoiceData,
    });

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back()
        }
    }

    const handleCreate = async (data: Billing): Promise<void> => {
        await postBilling(token, data)
            .then(() => {
                handleBack();
            })
            .catch((error) => {
                Alert.alert("Error", (error as Error).message);
            });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    className='flex ml-1.5'
                    onPress={handleSubmit(handleCreate)}
                    style={{
                        height: '100%',
                    }}
                >
                    <Entypo
                        color={Colors.principal.DEFAULT}
                        name="save"
                        size={24}
                    />
                </TouchableOpacity>
            )
        })
    }, [])

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // Offset dinámico para compensar el header superior de Expo Router en iOS
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 20, // Espacio extra para que el último input suba holgadamente
                }}
            >
                <View className="flex flex-col space-y-4 px-3 py-5 ">
                    <View>
                        {/* Razon Social */}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Razon Social"
                                    placeholder="razon social"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Calle o Vialidad */}
                    <View>
                        <Controller
                            control={control}
                            name="street"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Calle / Vialidad"
                                    placeholder="calle"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* No. Exterior */}
                    <View>
                        <Controller
                            control={control}
                            name="number_ext"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="No. Exterior"
                                    placeholder="numero exterior"
                                    value={field.value ? field.value.toString() : ""}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* No. Interior */}
                    <View>
                        <Controller
                            control={control}
                            name="number_int"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="No. Interior"
                                    placeholder="numero Interior"
                                    value={field.value ? field.value.toString() : ""}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* RFC */}
                    <View>
                        <Controller
                            control={control}
                            name="rfc"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="RFC"
                                    placeholder="XXXX0000000X0"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* CP */}
                    <View>
                        <Controller
                            control={control}
                            name="cp"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Codigo Postal"
                                    placeholder="codigo postal"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Pais */}
                    <View>
                        <Controller
                            control={control}
                            name="country"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Pais"
                                    placeholder="pais"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Estado */}
                    <View>
                        <Controller
                            control={control}
                            name="state"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Estado"
                                    placeholder="estado"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Municpio */}
                    <View>
                        <Controller
                            control={control}
                            name="city"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Municpio"
                                    placeholder="municipio"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Colonia */}
                    <View>
                        <Controller
                            control={control}
                            name="division"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Colonia o Fraccionamiento"
                                    placeholder="colonia o fraccionamiento"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Numero de Telefono */}
                    <View>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Numero de Telefono"
                                    placeholder="telefono"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    <View>
                        <Controller
                            control={control}
                            name="tax_regime"
                            render={({ field, fieldState }) => (
                                <RegimeSelect
                                    label="Régimen Fiscal"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}