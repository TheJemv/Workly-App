import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInputComponent } from 'components'
import { companyRequest } from 'services/api/company.api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { defaultRequestData, RequestData, requestDataResolver } from '@/types/Request/Request';
import { router } from 'expo-router';

export default function Request() {
    const { control, handleSubmit } = useForm<RequestData>({
        resolver: requestDataResolver,
        defaultValues: defaultRequestData,
    })

    const handleSave = async (data) => {
        try {
            await companyRequest(data).then(e => {
                if (router.canGoBack()) router.back()
            })
        } catch (e) {
            alert((e as Error).message)
        }
    }

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

