import SpinLoading from "components/SpinLoading";
import { AuthContext } from "context/AuthContext";
import useGlobal from "core/globals";
import { router } from "expo-router";
import { Colors } from "lib";
import { useContext, useState } from "react";
import { View, Text, Image, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { delService } from "services/api/services.api";

type Props = {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    photo: string;
    data: any;
};
export default function CardService({
    title,
    description,
    price,
    currency,
    photo,
    data,
}: Props) {
    const [loading, setLoading] = useState<Boolean>(false);
    const { token } = useContext(AuthContext);
    const removeTempService = useGlobal(s => s.removeTempService)

    class handleService {
        static Edit() {
            router.push({
                pathname: "/service-edit",
                params: {
                    id: data.id
                }
            })
        }

        static Delete() {
            Alert.alert(
                "Confirmación", // Título de la alerta
                "¿Estás seguro de que quieres continuar?", // Mensaje de la alerta
                [
                    {
                        text: "Cancelar", // Botón de cancelar
                        style: "default",
                    },
                    {
                        text: "Aceptar", // Botón de aceptar
                        onPress: () => {
                            setLoading(true);
                            delService(token, data?.id)
                                .catch((e) => {
                                    Alert.alert(
                                        "Error",
                                        "Ah ocurrido un error al borrar el servicio..."
                                    );
                                })
                                .finally(() => {
                                    setLoading(false);
                                    removeTempService(data.id)
                                });
                        }, // Acción cuando se presiona "Aceptar"
                        style: "destructive",
                    },
                ],
                { cancelable: false } // Si es true, la alerta puede ser cerrada al hacer clic fuera de ella
            );
        }
    }

    return (
        <View style={styles.container}>
            {!loading ? (
                <>
                    {/* Header con imagen y texto */}
                    <View style={styles.header}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: photo }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text
                                style={styles.title}
                                numberOfLines={1}
                            >
                                {title}
                            </Text>
                            <Text
                                style={styles.description}
                                numberOfLines={2}
                            >
                                {description}
                            </Text>
                        </View>
                    </View>

                    {/* Precio */}
                    {!data?.indefinite && (
                        <Text style={styles.price}>
                            Desde ${(price / 100).toFixed(2)} {currency.toUpperCase()}
                        </Text>
                    )}

                    {/* Botones de acción */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            onPress={handleService.Edit}
                            style={styles.button}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.buttonText}>
                                Editar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleService.Delete}
                            style={[styles.button, styles.deleteButton]}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.buttonText}>
                                Eliminar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View className="flex flex-col justify-center items-center flex-1 w-full my-9">
                    <SpinLoading size={32} />
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 16, // ✅ Reemplaza space-y-4 (4 * 4 = 16px)
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: Colors.border || '#E5E5E5',
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        gap: 12,
        width: '100%', // ✅ Importante para que ocupe todo el ancho
    },
    imageContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.light ? `${Colors.light}1A` : '#F5F5F510',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 16,
        color: Colors.dark || '#1F2937',
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: Colors.text || '#6B7280',
        fontWeight: '500',
    },
    price: {
        fontSize: 14,
        color: Colors.dark || '#1F2937',
        fontWeight: '700',
        alignSelf: 'flex-end',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        borderRadius: 8,
        backgroundColor: Colors.light || '#9CA3AF',
        paddingHorizontal: 20,
        paddingVertical: 4,
    },
    deleteButton: {
        backgroundColor: Colors.danger || '#EF4444',
    },
    buttonText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 36,
    },
});