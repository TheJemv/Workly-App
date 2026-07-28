import { AuthContext } from "context/AuthContext";
import { useContext, useState, useCallback, useMemo } from "react";
import {
    ScrollView,
    TouchableOpacity,
    View,
    Image,
    Text,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs";
import { Feather } from "@expo/vector-icons";

import { updateCompany } from "services/api/company.api";

import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";
import useGlobal from "core/globals";
import checkcompany from "utils/validations/companyValidation";
import { router } from "expo-router";
import OptionsKeyEnum from "enum/OptionsKeyEnum";

import ToggleSwitch from 'toggle-switch-react-native'

import { Platform } from "react-native";

const cardShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    android: {
        elevation: 2,
    },
});

const truncateText = (text: string, maxLength: number = 35) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB en bytes

function getByPath(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

const OptionsKey = [
    {
        title: "Descripción",
        key: OptionsKeyEnum.description,
        icon: "file-text" as const,
        description: "Esta descripción será visible para los clientes que visiten tu perfil."
    },
    {
        title: "Teléfono",
        key: OptionsKeyEnum.phone,
        icon: "phone" as const,
        description: "Los clientes podrán contactarte a través de este número."
    },
];

function buildByPath(path: string, value: any) {
    const keys = path.split(".");
    const result: any = {};
    let current = result;

    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = value;
        } else {
            current[key] = {};
            current = current[key];
        }
    });

    return result;
}

export default function Edit() {
    const companyData = useGlobal((state) => state.company);
    const reloadCompany = useGlobal((state) => state.companyReload);
    const { token } = useContext(AuthContext);

    const [loadingImage, setLoadingImage] = useState(false);
    const [currentImage, setCurrentImage] = useState(
        companyData?.profile?.photo
    );

    // Memorizar si el onboarding está completo
    const isOnboardingComplete = useMemo(
        () => checkcompany(companyData),
        [companyData]
    );

    /**
     * Obtiene el tamaño de un archivo desde su URI
     */
    const getFileSize = useCallback(async (uri: string): Promise<number> => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            return blob.size;
        } catch (error) {
            console.error("Error al obtener el tamaño del archivo:", error);
            return 0;
        }
    }, []);

    /**
     * Maneja la selección y actualización de la imagen de perfil
     */
    const handleImagePicker = useCallback(async () => {
        setLoadingImage(true);

        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    "Permisos requeridos",
                    "Necesitamos permiso para acceder a tus fotos"
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
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

            const base64 = await RNFS.readFile(imageUri, "base64");

            const data = await updateCompany({
                photo: base64,
            });

            if (data?.profile?.photo) {
                setCurrentImage(data.profile.photo);
                await reloadCompany();
                Alert.alert("Éxito", "Foto actualizada correctamente");
            }
        } catch (error: any) {
            console.error("Error al actualizar la foto:", error);
            Alert.alert(
                "Error",
                error?.message || "No se pudo actualizar la foto. Intenta de nuevo."
            );
        } finally {
            setLoadingImage(false);
        }
    }, [token, getFileSize, reloadCompany]);

    const [loadingPublicButton, setLoadingPublicButton] = useState<boolean>(false)
    const handleSaveData = async (key: any, value) => {
        try {
            setLoadingPublicButton(true)
            const data = buildByPath(key as string, value)
            await updateCompany(data).then(async () => {
                await reloadCompany();
                // if (router.canGoBack()) router.back()
                setLoadingPublicButton(false)
            })
        } catch (error) {
            setLoadingPublicButton(false)
            alert((error as Error).message)
        }
    }

    return (
        <ScrollView className="flex-1 bg-surface">
            {/* Banner + Avatar */}
            <View className="relative">
                <View className="h-32 bg-brand-banner relative bg-primary" style={cardShadow}>
                    <TouchableOpacity
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center shadow-sm"
                        onPress={() =>
                            Alert.alert(
                                "Editar cover",
                                "Funcionalidad de editar cover no implementada aún"
                            )
                        }
                    >
                        <Feather name="camera" size={15} color={Colors.principal.DEFAULT} />
                    </TouchableOpacity>
                </View>

                {/* Avatar */}
                <View className="absolute left-1/2 -ml-10 -bottom-10 z-10">
                    <View className="relative" style={cardShadow}>
                        <TouchableOpacity
                            onPress={handleImagePicker}
                            className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg items-center justify-center overflow-hidden"
                        >
                            {loadingImage ? (
                                <SpinLoading size={28} color={Colors.principal.DEFAULT} />
                            ) : currentImage ? (
                                <Image className="w-full h-full" source={{ uri: currentImage }} />
                            ) : (
                                <Feather name="user" size={36} color={Colors.principal[300]} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Nombre de la empresa */}
            <View className="mt-14 px-4 pb-4 items-center">
                <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() =>
                        router.push({
                            pathname: "/(edit)/option",
                            params: {
                                key: OptionsKeyEnum.name,
                                title: "Nombre",
                            },
                        })
                    }
                >
                    <Text className="text-lg font-bold text-text-dark text-center">
                        {companyData?.profile?.name}
                    </Text>
                    <Feather name="edit-2" size={14} color={Colors.principal.DEFAULT} />
                </TouchableOpacity>
            </View>

            {/* Onboarding */}
            <View className="px-4 mb-4">
                <Text className="text-xs font-semibold text-text-light uppercase tracking-widest mb-2 px-1">
                    Pagos
                </Text>

                <View className="rounded-xl bg-white" style={cardShadow}>
                    <View className="bg-white rounded-xl overflow-hidden border border-border-soft">
                        <TouchableOpacity
                            onPress={() => router.push("/(edit)/onboarding")}
                            activeOpacity={0.7}
                            className="flex-row items-center gap-3 px-4 py-3.5"
                        >
                            <View
                                className={`w-8 h-8 rounded-lg items-center justify-center ${isOnboardingComplete ? "bg-[#edf7f1]" : "bg-orange-50"
                                    }`}
                            >
                                <Feather
                                    name="check-circle"
                                    size={16}
                                    color={isOnboardingComplete ? Colors.green[600] : Colors.orange[600]}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-semibold text-text-light">Onboarding</Text>
                                <Text
                                    className="text-sm font-medium"
                                    style={{ color: isOnboardingComplete ? Colors.green[600] : Colors.orange[600] }}
                                >
                                    {isOnboardingComplete ? "Completado" : "Incompleto"}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={16} color={Colors.principal[300]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Información general */}
            <View className="px-4 mb-4">
                <Text className="text-xs font-semibold text-text-light uppercase tracking-widest mb-2 px-1">
                    Información general
                </Text>

                <View className="rounded-xl bg-white" style={cardShadow}>
                    <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-soft">
                        {OptionsKey.map((v, k) => {
                            const value = getByPath(companyData, v.key);
                            return (
                                <View key={k}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/(edit)/option",
                                                params: {
                                                    key: v.key,
                                                    title: v.title,
                                                    description: v.description
                                                },
                                            })
                                        }
                                        activeOpacity={0.7}
                                        className="flex-row items-center gap-3 px-4 py-3.5"
                                    >
                                        <View className="w-8 h-8 rounded-lg bg-brand-light/50 items-center justify-center">
                                            <Feather name={v.icon} size={16} color={Colors.principal.DEFAULT} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-semibold text-text-light">{v.title}</Text>
                                            <Text className="text-sm text-text-default" numberOfLines={1}>
                                                {value ? truncateText(value) : "Sin asignar"}
                                            </Text>
                                        </View>
                                        <Feather name="chevron-right" size={16} color={Colors.principal[300]} />
                                    </TouchableOpacity>

                                    {/* Separador manual - solo si NO es el último elemento */}
                                    {k < OptionsKey.length - 1 && (
                                        <View className="h-[1px] bg-border-soft ml-[0px]" />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Visibilidad */}
            <View className="px-4 mb-4">
                <Text className="text-xs font-semibold text-text-light uppercase tracking-widest mb-2 px-1">
                    Visibilidad
                </Text>

                <View className="rounded-xl bg-white" style={cardShadow}>
                    <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-soft">
                        {/* <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/(edit)/option",
                                    params: {
                                        key: OptionsKeyEnum.public,
                                        title: "Privacidad",
                                    },
                                })
                            }
                            activeOpacity={0.7}
                            className="flex-row items-center gap-3 px-4 py-3.5"
                        > */}
                        <View className="flex-row items-center gap-3 px-4 py-3.5">
                            <View className="w-8 h-8 rounded-lg bg-brand-light/50 items-center justify-center">
                                <Feather
                                    name={getByPath(companyData, OptionsKeyEnum.public) ? "eye" : "eye-off"}
                                    size={16}
                                    color={Colors.principal.DEFAULT}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-semibold text-text-light">Privacidad</Text>
                                <Text className="text-sm text-text-default">
                                    {getByPath(companyData, OptionsKeyEnum.public) ? "Pública" : "Privada"}
                                </Text>
                            </View>

                            <ToggleSwitch
                                isOn={getByPath(companyData, OptionsKeyEnum.public)}
                                onColor={Colors.principal.DEFAULT}
                                offColor="#eaeaea"
                                labelStyle={{ color: "black", fontWeight: "900" }}
                                onToggle={isOn => {
                                    handleSaveData(OptionsKeyEnum.public, isOn)
                                }}
                                disabled={loadingPublicButton}
                            />

                            {loadingPublicButton && (
                                <View className="mx-auto absolute top-1 right-1">
                                    <SpinLoading size={14} />
                                </View>
                            )}

                            {/* <Feather name="chevron-right" size={16} color={Colors.principal[300]} /> */}
                        </View>
                        {/* </TouchableOpacity> */}
                    </View>
                </View>
            </View>

            {/* Horarios */}
            <View className="px-4 mb-6">
                <Text className="text-xs font-semibold text-text-light uppercase tracking-widest mb-2 px-1">
                    Horarios y disponibilidad
                </Text>


                <View className="rounded-xl bg-white" style={cardShadow}>
                    <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-soft">
                        <TouchableOpacity
                            onPress={() => router.push("/(edit)/schedule")}
                            activeOpacity={0.7}
                            className="flex-row items-center gap-3 px-4 py-3.5"
                        >
                            <View className="w-8 h-8 rounded-lg bg-brand-light/50 items-center justify-center">
                                <Feather name="clock" size={16} color={Colors.principal.DEFAULT} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-semibold text-text-light">Horarios de atención</Text>
                                <Text className="text-sm text-brand font-medium">Editar horarios</Text>
                            </View>
                            <Feather name="chevron-right" size={16} color={Colors.principal[300]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}