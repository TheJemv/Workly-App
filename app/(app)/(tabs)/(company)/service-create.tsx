import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Platform
} from 'react-native'
import { TextInput } from "components/Profile/Billing/components/text-input"
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import useGlobal from 'core/globals'
import { Colors } from 'lib'
import { Controller, useForm } from 'react-hook-form'
import { defaultServiceData, ServiceData, serviceDataResolver } from '@/types/Service/EditService.types'
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs";
import SpinLoading from "components/SpinLoading";
import { Dropdown } from 'react-native-element-dropdown'
import ServiceCategoryEnum from 'enum/ServiceCategoryEnum'
import { MoneyTextInput } from '@alexzunik/react-native-money-input';
import { setService } from 'services/api/services.api'
import LoadingScreen from 'components/LoadingScreen'

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export default function ServiceCreate() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [loadingImage, setLoadingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const companyReload = useGlobal(state => state.companyReload)
    const { control, handleSubmit, reset, watch, setValue, getValues } = useForm<ServiceData>({
        resolver: serviceDataResolver,
        defaultValues: defaultServiceData,
    });
    watch();


    const getFileSize = async (uri: string): Promise<number> => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            return blob.size;
        } catch (error) {
            console.error("Error al obtener el tamaño del archivo:", error);
            return 0;
        }
    };

    const handleImageService = async () => {
        setLoadingImage(true);
        try {
            // Solicitar permisos
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Permisos requeridos",
                    "Necesitamos permiso para acceder a tus fotos"
                );
                return;
            }

            // Abrir selector de imágenes
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
            if (result.canceled) {
                return;
            }

            const imageUri = result.assets[0].uri;
            const fileSize = await getFileSize(imageUri);
            if (fileSize >= MAX_FILE_SIZE) {
                Alert.alert(
                    "Archivo muy grande",
                    "La imagen no puede ser mayor de 10MB. Por favor, elige otra imagen."
                );
                return;
            }

            // Convertir a base64
            const base64 = await RNFS.readFile(imageUri, "base64");
            setValue('photo', base64, {
                shouldDirty: true,
                shouldValidate: true
            });
            setCurrentImage(`data:image/jpeg;base64,${base64}`);

        } catch (error) {
            console.error("Error al actualizar la foto:", error);
            Alert.alert(
                "Error",
                error?.message || "No se pudo actualizar la foto. Intenta de nuevo."
            );
        } finally {
            setLoadingImage(false);
        }
    };

    const handleSave = async (data: ServiceData) => {
        setLoading(true)
        try {
            setIsSubmitting(true)
            await setService(data)
            companyReload()
            if (router.canGoBack()) {
                router.back()
            }
        } catch (e) {
            alert(e.message)
        } finally {
            setIsSubmitting(false)
            setLoading(false)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    className='flex ml-1.5'
                    onPress={handleSubmit(handleSave)}
                    style={{ height: '100%' }}
                    disabled={isSubmitting}
                >
                    <Entypo
                        color={Colors.principal.DEFAULT}
                        name="save"
                        size={24}
                    />
                </TouchableOpacity>
            )
        })
    }, [isSubmitting])


    return loading ? (
        <LoadingScreen />
    ) : (
        <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                className='flex-1 px-3 py-4'
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formContainer}>
                    {/* Imagen del servicio */}
                    <Controller
                        control={control}
                        name='photo'
                        render={({ field, fieldState }) => (
                            <TouchableOpacity
                                onPress={handleImageService}
                                disabled={loadingImage}
                                className="flex flex-col items-center mb-6"
                                activeOpacity={0.7}
                            >
                                <View
                                    className="items-center justify-center"
                                    style={styles.imageBox}
                                >
                                    {loadingImage ? (
                                        <SpinLoading
                                            size={32}
                                            color={Colors.principal.DEFAULT}
                                        />
                                    ) : (
                                        <Image
                                            style={styles.image}
                                            source={{ uri: currentImage || field.value }}
                                            resizeMode="cover"
                                        />
                                    )}
                                </View>
                                <Text className="text-primary text-base font-medium mt-2">
                                    Cambiar foto del servicio
                                </Text>
                                {fieldState.error && (
                                    <Text className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    {/* Nombre del servicio */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name='name'
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Nombre"
                                    placeholder='Nombre del servicio'
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Descripción del servicio */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name='description'
                            render={({ field, fieldState }) => (
                                <TextInput
                                    label="Descripción"
                                    placeholder='Describe tu servicio'
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    multiline
                                    maxLength={256}
                                />
                            )}
                        />
                    </View>

                    {/* Precio indefinido o definido */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name='indefinite'
                            render={({ field }) => (
                                <View>
                                    <Text style={styles.textDropdown}>Precio Fijo</Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        selectedTextStyle={{
                                            color: "#050505",
                                            fontSize: 14,
                                        }}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Escoge tu categoría"
                                        placeholderStyle={{
                                            color: "#92929D",
                                            fontSize: 14,
                                        }}
                                        itemContainerStyle={{
                                            backgroundColor: Colors.white,
                                            borderRadius: 8,
                                        }}
                                        containerStyle={{
                                            borderRadius: 8,
                                            borderWidth: 1,
                                        }}
                                        dropdownPosition="top"
                                        data={[
                                            { label: "Indefinido", value: true },
                                            { label: "Fijo", value: false },
                                        ]}
                                        value={field?.value}
                                        onChange={(item) => field.onChange(item.value)}
                                    />
                                </View>
                            )}
                        />
                    </View>

                    {/* ¿Solicitar ubicación? */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name='requiresLocation'
                            render={({ field }) => (
                                <View>
                                    <Text style={styles.textDropdown}>¿Solicitar ubicación?</Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        selectedTextStyle={{ color: "#050505", fontSize: 14 }}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="¿Requiere ubicación?"
                                        placeholderStyle={{ color: "#92929D", fontSize: 14 }}
                                        itemContainerStyle={{ backgroundColor: Colors.white, borderRadius: 8 }}
                                        containerStyle={{ borderRadius: 8, borderWidth: 1 }}
                                        dropdownPosition="top"
                                        data={[
                                            { label: "No", value: false },
                                            { label: "Sí", value: true },
                                        ]}
                                        value={field.value}
                                        onChange={(item) => field.onChange(item.value)}
                                    />
                                </View>
                            )}
                        />
                    </View>

                    {/* Precio con formato */}
                    {!getValues().indefinite && (
                        <Controller
                            control={control}
                            name='unit_amount'
                            render={({ field, fieldState }) => (
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.textDropdown}>Precio</Text>
                                    <MoneyTextInput
                                        className="py-2 px-2 rounded-lg border border-dark/10"
                                        value={(field.value / 100).toString()}
                                        onChangeText={(_formatted, extracted) => {
                                            field.onChange(Number(extracted) * 100)
                                        }}
                                        style={{
                                            padding: 8,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: "#04040420"
                                        }}
                                        prefix="$"
                                        groupingSeparator=","
                                        fractionSeparator="."
                                        placeholderTextColor={"#92929D"}
                                        placeholder='$50.00'
                                    />
                                </View>
                            )}
                        />
                    )}

                    {/* Categoría */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name='category'
                            render={({ field, fieldState }) => (
                                <View className='flex flex-col gap-y-1'>
                                    <Text style={styles.textDropdown}>Categoría</Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        selectedTextStyle={{
                                            color: "#050505",
                                            fontSize: 14,
                                        }}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Escoge tu categoría"
                                        placeholderStyle={{
                                            color: "#92929D",
                                            fontSize: 14,
                                        }}
                                        itemContainerStyle={{
                                            backgroundColor: Colors.white,
                                            borderRadius: 8,
                                        }}
                                        containerStyle={{
                                            borderRadius: 8,
                                            borderWidth: 1,
                                        }}
                                        dropdownPosition="top"
                                        data={Object.keys(ServiceCategoryEnum).map(
                                            key => ({
                                                label: ServiceCategoryEnum[key],
                                                value: ServiceCategoryEnum[key]
                                            })
                                        )}
                                        value={field.value}
                                        onChange={(item) => field.onChange(item.value)}
                                    />
                                    {fieldState.error && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {fieldState.error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        paddingBottom: 20,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 100,
    },
    imageBox: {
        width: 140,
        height: 140,
        borderRadius: 200,
        borderWidth: 4,
        display: "flex",
        flexDirection: "column",
        borderStyle: "dashed",
        borderColor: "#364670",
    },
    textDropdown: {
        color: Colors.principal.DEFAULT,
        fontSize: 14,
        fontWeight: '700',
    },
    dropdown: {
        backgroundColor: Colors.transparent,
        borderRadius: 8,
        borderWidth: 1,
        padding: 8,
        borderColor: "#04040420"
    }
});