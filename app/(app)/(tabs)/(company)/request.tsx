import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { TextInputComponent } from 'components'
import { companyRequest } from 'services/api/company.api';
import { Controller, useForm } from 'react-hook-form';
import { defaultRequestData, RequestData, requestDataResolver } from '@/types/Request/Request';
import { router } from 'expo-router';
import { Colors } from 'lib';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Request() {
    const [terms, setTerms] = useState<boolean>(false)
    const { control, handleSubmit } = useForm<RequestData>({
        resolver: requestDataResolver,
        defaultValues: defaultRequestData,
    })

    const handleSave = async (data) => {
        try {
            if (!terms) {
                alert("Tienes que aceptar los terminos y condiciones para empresas.")
                return
            }
            await companyRequest(data).then(e => {
                if (router.canGoBack()) router.back()
            })
        } catch (e) {
            alert((e as Error).message)
        }
    }


    const handleTerms = () => router.push('/service-provider-contract');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 38 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: 18,
                            paddingBottom: 20,
                            gap: 18,
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* Top Side */}
                        <View style={{ flex: 1, gap: 0 }}>
                            <Text className="text-2xl font-bold">
                                Envia tu solicitud.
                            </Text>
                            <Text className="text-text mt-2">
                                Envíanos tu solicitud para iniciar tu registro como
                                socio. Este formulario nos permitirá conocer tu perfil y
                                determinar la mejor manera de colaborar contigo. Damos
                                este primer paso contigo para construir una relación
                                sólida y profesional.
                            </Text>
                        </View>

                        {/* Bottom Side */}
                        <View style={{ gap: 12, paddingBottom: 20 }}>

                            {/* Nombre de la empresa */}
                            <Controller
                                control={control}
                                name='name'
                                render={({ field, fieldState }) => (
                                    <View>
                                        <TextInputComponent
                                            placeholder="nombre de empresa"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />

                                        {fieldState.error?.message && (
                                            <Text>{fieldState.error.message}</Text>
                                        )}
                                    </View>
                                )}
                            />


                            {/* Email de la empresa */}
                            <Controller
                                control={control}
                                name='email'
                                render={({ field, fieldState }) => (
                                    <View className='flex flex-col w-full'>
                                        <TextInputComponent
                                            placeholder="email de empresa"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                        {fieldState.error?.message && (
                                            <Text>{fieldState.error.message}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            {/* RFC de la empresa */}
                            <Controller
                                control={control}
                                name='rfc'
                                render={({ field, fieldState }) => (
                                    <View>
                                        <TextInputComponent
                                            placeholder="rfc de empresa"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                        {fieldState.error?.message && (
                                            <Text>{fieldState.error.message}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            {/* Telefono de la empresa */}
                            <Controller
                                control={control}
                                name='phone'
                                render={({ field, fieldState }) => (
                                    <View>
                                        <TextInputComponent
                                            placeholder="telefono de empresa"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                        {fieldState.error?.message && (
                                            <Text>{fieldState.error.message}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <View style={styles.termsContainer}>
                                <Checkbox
                                    value={terms}
                                    onValueChange={() => setTerms(!terms)}
                                    color={Colors.principal.DEFAULT}
                                />
                                <View style={styles.termsTextContainer}>
                                    <Text>Acepto los </Text>
                                    <TouchableOpacity onPress={handleTerms}>
                                        <Text style={styles.termsLink}>
                                            Terminos y Condiciones
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <TouchableOpacity
                                onPress={handleSubmit(handleSave)}
                                className="items-center justify-center bg-primary py-3 rounded-lg"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-base">
                                    Enviar Solicitud
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    termsTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    termsLink: {
        color: '#040048',
        fontWeight: '600',
    },
})