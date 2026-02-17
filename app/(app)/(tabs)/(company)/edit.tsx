import { useNavigation, useRoute } from "@react-navigation/native";
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
import getValue from "utils/getValue";
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs";

import { updateCompany } from "services/api/company.api";

import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";
import useGlobal from "core/globals";
import checkcompany from "utils/validations/companyValidation";
import { router } from "expo-router";
import OptionsKeyEnum from "enum/OptionsKeyEnum";

import { Entypo, AntDesign } from "@expo/vector-icons";


const truncateText = (text: string, maxLength: number = 35) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB en bytes
interface RouteParams {
    [key: string]: {
        title: string;
        key: string;
    };
}

function getByPath(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

const OptionsKey = [
    {
        title: "Descripcion",
        key: OptionsKeyEnum.description,
    },
    {
        title: "Telefono",
        key: OptionsKeyEnum.phone,
    },
    {
        title: "Privacidad",
        key: OptionsKeyEnum.public,
        type: "boolean",
    },
];


export default function Edit() {
    const navigation = useNavigation();
    const route = useRoute();

    const companyData = useGlobal((state) => state.company);
    const reloadCompany = useGlobal((state) => state.companyReload);

    const options = route.params as RouteParams;
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
            // Solicitar permisos si es necesario
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
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8, // Reducir calidad para optimizar tamaño
            });

            if (result.canceled) {
                return;
            }

            const imageUri = result.assets[0].uri;

            // Validar tamaño del archivo
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

            // Actualizar en el servidor
            const data = await updateCompany({
                photo: base64,
            });

            // Actualizar estado local y recargar datos
            if (data?.profile?.photo) {
                setCurrentImage(data.profile.photo);
                await reloadCompany();
                Alert.alert("Éxito", "Foto actualizada correctamente");
            }
        } catch (error) {
            console.error("Error al actualizar la foto:", error);
            Alert.alert(
                "Error",
                error?.message || "No se pudo actualizar la foto. Intenta de nuevo."
            );
        } finally {
            setLoadingImage(false);
        }
    }, [token, getFileSize, reloadCompany]);

    return (
        <ScrollView className="flex-1 px-2">
            <View className="flex flex-col flex-1">
                {/* Sección de foto de perfil */}
                <View className="flex flex-col items-center justify-center" style={{ gap: 32 }}>
                    <View style={{ backgroundColor: Colors.principal[200], borderRadius: 12 }} className="w-full h-48 flex items-center justify-center">
                        {/* Editar cover */}
                        <TouchableOpacity style={{ position: "absolute", top: 12, right: 12, backgroundColor: "#fff", padding: 6, borderRadius: 9999 }} onPress={() => Alert.alert("Editar cover", "Funcionalidad de editar cover no implementada aún")}>
                            <Entypo name="edit" size={18} color={Colors.principal.DEFAULT} />
                        </TouchableOpacity>

                        {/* Foto de perfil */}
                        <TouchableOpacity onPress={handleImagePicker} style={{ width: 150, height: 150, borderRadius: 9999, overflow: "hidden", backgroundColor: "white" }} className="absolute -bottom-8 border-[#f2f2f2] border-4">
                            {loadingImage ? (
                                <SpinLoading
                                    size={32}
                                    color={Colors.principal.DEFAULT}
                                />
                            ) : (
                                <Image
                                    className="w-full h-full rounded-2xl"
                                    source={{ uri: currentImage }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className="flex flex-row items-center" style={{ gap: 6 }} onPress={() => {
                        router.push({
                            pathname: "/(edit)/option",
                            params: {
                                key: OptionsKeyEnum.name,
                                title: "Nombre",
                            }
                        })
                    }}>
                        <Text className="text-xl font-bold" style={{ color: Colors.principal.DEFAULT }}>
                            {companyData.profile.name}
                        </Text>
                        <Entypo name="edit" size={18} color={Colors.principal.DEFAULT} />
                    </TouchableOpacity>
                </View>

                {/* Opciones de edición */}
                <View className="flex flex-col">
                    <Text className="text-sm font-bold text-dark mt-6 mb-2" style={{ color: Colors.principal.DEFAULT }}>
                        Editar información
                    </Text>

                    {/* Opciones dinámicas de edición */}
                    <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {OptionsKey.map((v, k) => {
                            return (
                                <TouchableOpacity
                                    key={k}
                                    onPress={() => {
                                        router.push({
                                            pathname: "/(edit)/option",
                                            params: {
                                                key: v.key,
                                                title: v.title,
                                            }
                                        })
                                    }}
                                    activeOpacity={0.7}
                                    style={{ borderWidth: 1, borderColor: Colors.principal.DEFAULT, borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 6 }}
                                >
                                    <Text style={{ color: Colors.principal.DEFAULT }} className="font-semibold text-base">
                                        {v.title}
                                    </Text>

                                    {v.key === "public" ? (
                                        <View style={{ gap: 4, marginLeft: 8, display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            <AntDesign
                                                name={getByPath(companyData, v.key) ? "eye" : "eye-invisible"}
                                                size={18}
                                                color={Colors.principal[300]}
                                            />
                                            <Text style={{ color: Colors.principal[300] }}>{getByPath(companyData, v.key) ? "Publica" : "Privada"}</Text>
                                        </View>
                                    ) : (
                                        <Text style={{ color: Colors.principal[300] }} className="text-dark/90" numberOfLines={1}>
                                            {getByPath(companyData, v.key) ? truncateText(getByPath(companyData, v.key)) : "Asigne su numero"}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )
                        })}

                        {/* Horarios de atención */}
                        <TouchableOpacity
                            onPress={() => router.push("/(edit)/schedule")}
                            activeOpacity={0.7}
                            style={{ borderWidth: 1, borderColor: Colors.principal.DEFAULT, borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 6 }}
                        >
                            <Text style={{ color: Colors.principal.DEFAULT }} className="font-semibold text-base">
                                Horarios de atención
                            </Text>
                            <Text style={{ color: Colors.principal[300] }} className="text-dark/90" numberOfLines={1}>
                                Editar horarios
                            </Text>
                        </TouchableOpacity>

                        {/* Onboarding */}
                        <TouchableOpacity
                            onPress={() => router.push("/(edit)/onboarding")}
                            activeOpacity={0.7}
                            style={{ borderWidth: 1, borderColor: Colors.principal.DEFAULT, borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 6 }}
                        >
                            <Text style={{ color: Colors.principal.DEFAULT }} className="font-semibold text-base">
                                Onboarding
                            </Text>
                            <Text
                                style={{
                                    color: isOnboardingComplete ? Colors.green[600] : Colors.orange[600],
                                }}
                                className="font-medium"
                                numberOfLines={1}
                            >
                                {isOnboardingComplete ? "✓ Completado" : "Incompleto"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <TouchableOpacity
                    onPress={handleImagePicker}
                    disabled={loadingImage}
                    className="flex flex-col items-center justify-center border-black/20 border-b py-4 space-y-3"
                    activeOpacity={0.7}
                >
                    <View
                        className="rounded-full overflow-hidden bg-gray-200 flex flex-col items-center justify-center"
                        style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                    >
                        {loadingImage ? (
                            <SpinLoading
                                size={32}
                                color={Colors.principal.DEFAULT}
                            />
                        ) : (
                            <Image
                                className="w-full h-full rounded-full"
                                source={{ uri: currentImage }}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                    <Text className="text-primary text-base font-medium">
                        Cambiar foto
                    </Text>
                </TouchableOpacity> */}

                {/* Opciones dinámicas de edición */}
                {/* {options && Object.entries(options).map(([index, { title, key }]) => {
                    const value = getValue(companyData, key);
                    const hasValue = value !== "" && value !== null && value !== undefined;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigateToEdit(title)}
                            className="w-full py-3 px-2 flex flex-row items-center justify-between border-black/20 border-b"
                            activeOpacity={0.7}
                        >
                            <Text className="text-dark font-semibold text-base">
                                {title}
                            </Text>
                            <Text
                                className={hasValue ? "text-dark/90" : "text-text/60"}
                                numberOfLines={1}
                                style={{ flex: 1, textAlign: "right", marginLeft: 12 }}
                            >
                                {getDisplayValue(key, title)}
                            </Text>
                        </TouchableOpacity>
                    );
                })} */}

                {/* Options */}
                {/* {OptionsKey.map((v, k) => {
                    return (
                        <TouchableOpacity
                            key={k}
                            onPress={() => {
                                router.push({
                                    pathname: "/(edit)/option",
                                    params: {
                                        key: v.key,
                                        title: v.title,
                                    }
                                })
                            }}
                            className="w-full py-3 px-2 flex flex-row items-center justify-between border-black/20 border-b"
                            activeOpacity={0.7}
                        >
                            <Text className="text-dark font-semibold text-base">
                                {v.title}
                            </Text>
                            <Text className="text-dark/90" numberOfLines={1}>
                                {v?.type === "boolean" ? (
                                    getByPath(companyData, v.key) ? "Publico" : "Privada"
                                ) : (
                                    getByPath(companyData, v.key) ? truncateText(getByPath(companyData, v.key)) : "Asigen su numero"
                                )}
                            </Text>
                        </TouchableOpacity>
                    )
                })} */}

                {/* Horarios de atención */}
                {/* <TouchableOpacity
                    onPress={() => router.push("/(edit)/schedule")}
                    className="w-full py-3 px-2 flex flex-row items-center justify-between border-black/20 border-b"
                    activeOpacity={0.7}
                >
                    <Text className="text-dark font-semibold text-base">
                        Horarios de atención
                    </Text>
                    <Text className="text-dark/90" numberOfLines={1}>
                        Editar horarios
                    </Text>
                </TouchableOpacity> */}

                {/* Onboarding */}
                {/* <TouchableOpacity
                    onPress={() => router.push("/(edit)/onboarding")}
                    className="w-full py-3 px-2 flex flex-row items-center justify-between border-black/20 border-b"
                    activeOpacity={0.7}
                >
                    <Text className="text-dark font-semibold text-base">
                        Onboarding
                    </Text>
                    <Text
                        className={
                            isOnboardingComplete
                                ? "text-green-600 font-medium"
                                : "text-orange-600 font-medium"
                        }
                        numberOfLines={1}
                    >
                        {isOnboardingComplete ? "✓ Completado" : "Incompleto"}
                    </Text>
                </TouchableOpacity> */}
            </View>
        </ScrollView>
    );
};
