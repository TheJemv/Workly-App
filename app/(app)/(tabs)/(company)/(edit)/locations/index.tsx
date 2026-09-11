import { useCallback, useLayoutEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { router, useFocusEffect, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { delCompanyLocation, getCompanyLocations } from "services/api/companyLocation.api";
import { getUserMessage } from "services/api/errors";
import { CompanyLocation } from "@/types/Location";
import { Colors } from "lib";
import { COLOR_BACKGROUND } from "constants/index";
import CompanyLocationListItem from "components/Company/CompanyLocationListItem";
import LoadingScreen from "components/LoadingScreen";

export default function CompanyLocations() {
    const navigation = useNavigation();
    const [data, setData] = useState<CompanyLocation[]>([]);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        try {
            const res = await getCompanyLocations();
            setData(res.data ?? []);
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [reload]),
    );

    const goToCreate = () => router.push("/(edit)/locations/create");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity className="ml-1.5" onPress={goToCreate}>
                    <Feather name="plus-circle" size={22} color={Colors.principal.DEFAULT} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Eliminar sucursal",
            `¿Eliminar "${name}"? Los servicios que la usen se quedarán sin sucursal asignada.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await delCompanyLocation(id);
                            setData((prev) => prev.filter((l) => l.id !== id));
                        } catch (error) {
                            Alert.alert("Error", getUserMessage(error));
                        }
                    },
                },
            ],
        );
    };

    if (loading) return <LoadingScreen />;

    return (
        <View style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 12, gap: 12, flexGrow: 1 }}
                renderItem={({ item }) => (
                    <CompanyLocationListItem
                        location={item}
                        onDelete={() => handleDelete(item.id, item.name)}
                    />
                )}
                ListEmptyComponent={
                    <View
                        className="flex-1 items-center justify-center px-8"
                        style={{ gap: 12, paddingTop: 64 }}
                    >
                        <Image
                            source={require("assets/Empty/Locations.png")}
                            style={{ width: 150, height: 120 }}
                            contentFit="contain"
                        />
                        <View style={{ gap: 4 }}>
                            <Text className="text-dark font-semibold text-base text-center">
                                Sin sucursales
                            </Text>
                            <Text className="text-text text-[13px] text-center">
                                Crea una sucursal para los servicios donde el cliente llega directamente contigo.
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={goToCreate}
                            className="flex-row items-center rounded-xl"
                            style={{ backgroundColor: Colors.principal[100], gap: 8, paddingVertical: 11, paddingHorizontal: 18 }}
                        >
                            <Feather name="plus-circle" size={16} color={Colors.principal.DEFAULT} />
                            <Text className="font-semibold" style={{ color: Colors.principal.DEFAULT }}>
                                Agregar sucursal
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}
