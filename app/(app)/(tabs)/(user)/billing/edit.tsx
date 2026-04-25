import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { invoiceDataResolver, InvoiceData, defaultInvoiceData } from "@/types/Billing/Billing";
import { TextInput } from "components/Profile/Billing/components/text-input";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "lib";
import { RegimeSelect } from "components/Profile/Billing/regime-select";
import { patchBilling } from "services/api/billing.api";


export default function Edit() {
    const params = useLocalSearchParams()
    const data: InvoiceData = params as InvoiceData;
    const navigation = useNavigation()
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { control, handleSubmit, reset, watch } = useForm<InvoiceData>({
        resolver: invoiceDataResolver,
        defaultValues: defaultInvoiceData,
    });

    // Observa todos los campos del formulario
    const formValues = watch();

    useEffect(() => {
        if (data) reset(data);
    }, []);

    // Compara los valores actuales con los originales
    useEffect(() => {
        if (data) {
            const isDifferent = JSON.stringify(formValues) !== JSON.stringify(data);
            setHasChanges(isDifferent);
        }
    }, [formValues, data]);

    const handleUpdate = async (data: InvoiceData): Promise<void> => {
        setIsLoading(true)
        try {
            await patchBilling(data.id, data)
            navigation.goBack()
        } catch (error) {
            Alert.alert("Error", (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => hasChanges ? (
                <TouchableOpacity
                    className='flex ml-1.5'
                    onPress={handleSubmit(handleUpdate)}
                    style={{
                        height: '100%',
                    }}
                    disabled={isLoading}
                >
                    <Entypo
                        color={Colors.principal.DEFAULT}
                        name="save"
                        size={24}
                    />
                </TouchableOpacity>
            ) : null
        })
    }, [hasChanges])

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <ScrollView className="flex-1">
                <View className="flex flex-col space-y-5 px-3 py-5 mb-2">
                    <View>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Nombre"
                                    placeholder="Nombre"
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
                            name="rfc"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="RFC"
                                    placeholder="RFC"
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
                            name="street"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Calle"
                                    placeholder="Calle"
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
                            name="division"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Colonia"
                                    placeholder="Colonia"
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
                            name="cp"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="C.P."
                                    placeholder="C.P."
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
                            name="state"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Estado"
                                    placeholder="Estado"
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
                            name="phone"
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Tel."
                                    placeholder="Tel."
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