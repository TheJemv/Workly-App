import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Entypo } from "@expo/vector-icons";

import useGlobal from 'core/globals'
import { Colors } from 'lib'
import { defaultServiceData, ServiceData, serviceDataResolver } from '@/types/Service/EditService.types'
import { setService } from 'services/api/services.api'
import { useApiFormErrors } from 'hooks/useApiFormErrors'
import LoadingScreen from 'components/LoadingScreen'
import SpinLoading from 'components/SpinLoading'
import ServiceImagePicker from 'components/Service/ServiceImagePicker'
import ServiceFormFields from 'components/Service/ServiceFormFields'
import { COLOR_BACKGROUND } from 'constants/index'

export default function ServiceCreate() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const companyReload = useGlobal(state => state.companyReload)

    const form = useForm<ServiceData>({
        resolver: serviceDataResolver,
        defaultValues: defaultServiceData,
    });
    const { control, handleSubmit } = form;
    const handleApiError = useApiFormErrors(form);

    const handleSave = async (data: ServiceData) => {
        setLoading(true)
        try {
            setIsSubmitting(true)
            await setService(data)
            companyReload()
            if (router.canGoBack()) router.back()
        } catch (e: any) {
            handleApiError(e)
        } finally {
            setIsSubmitting(false)
            setLoading(false)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    className='ml-1.5'
                    onPress={handleSubmit(handleSave)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <SpinLoading size={24} color={Colors.principal.DEFAULT} />
                    ) : (
                        <Entypo color={Colors.principal.DEFAULT} name="save" size={24} />
                    )}
                </TouchableOpacity>
            )
        })
    }, [isSubmitting])

    if (loading) return <LoadingScreen />

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
