import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native'
import { Image } from "expo-image"
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

import useGlobal from 'core/globals'
import { Service } from '@/types/Company'
import { defaultServiceData, ServiceData, serviceDataResolver } from '@/types/Service/EditService.types'
import getChangedProperties from 'utils/CompareObjects'
import { patchService } from 'services/api/services.api'
import { useApiFormErrors } from 'hooks/useApiFormErrors'
import SaveButton from 'components/Header/SaveButton'
import ServiceImagePicker from 'components/Service/ServiceImagePicker'
import ServiceFormFields from 'components/Service/ServiceFormFields'
import { COLOR_BACKGROUND } from 'constants/index'

export default function EditService() {
    const params = useLocalSearchParams()
    const navigation = useNavigation()

    const services = useGlobal(state => state.services)
    const service = services.data.find((s: Service) => s.id === params.id)

    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitRef = useRef<() => void>(() => { })

    const form = useForm<ServiceData>({
        resolver: serviceDataResolver,
        defaultValues: defaultServiceData,
    });
    const { control, handleSubmit, reset, watch } = form;
    const handleApiError = useApiFormErrors(form);

    const formValues = watch();

    useEffect(() => {
        if (service) reset(service);
    }, [service]);

    useEffect(() => {
        if (service) {
            setHasChanges(JSON.stringify(formValues) !== JSON.stringify(service));
        }
    }, [formValues, service]);

    const handleUpdate = useCallback(async (data: ServiceData) => {
        setIsSubmitting(true);
        try {
            const newData = getChangedProperties(service, data);

            // `getChangedProperties` hace merge por índice y rompe los arreglos.
            // El backend REEMPLAZA `addons` completo (contrato §4.2), así que si
            // cambió cualquier cosa, mandamos la lista entera con sus `id`.
            const prevAddons = JSON.stringify(service?.addons ?? []);
            const nextAddons = JSON.stringify(data.addons ?? []);
            if (prevAddons !== nextAddons) {
                newData.addons = data.addons ?? [];
            } else {
                delete newData.addons;
            }

            await patchService(service.id, newData);
            if (router.canGoBack()) router.back()
        } catch (error: any) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    }, [service]);

    useEffect(() => {
        submitRef.current = handleSubmit(
            handleUpdate,
            (errors) => console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2))
        )
    }, [handleSubmit, handleUpdate])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => hasChanges
                ? <SaveButton onPress={() => submitRef.current()} isSubmitting={isSubmitting} />
                : null
        })
    }, [hasChanges, isSubmitting])

    if (!service) {
        return (
            <View className="flex-1 items-center justify-center px-6">
                <Image
                    source={require("assets/Empty/ServiceNotFound.png")}
                    style={{ width: 200, height: 200 }}
                    contentFit="contain"
                />
                <View className="mt-2">
                    <Text className="text-gray-800 text-xl font-semibold text-center mb-2">
                        Error al encontrar el servicio
                    </Text>
                    <Text className="text-gray-500 text-base text-center">
                        Vuelve a intentarlo más tarde o repórtalo en Soporte.
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 32 }}
            >
                <Controller
                    control={control}
                    name='photo'
                    render={({ field, fieldState }) => (
                        <ServiceImagePicker
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <ServiceFormFields form={form} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
