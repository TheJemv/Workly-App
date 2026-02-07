import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { ServiceItem } from "components/Home/ServicesTrending/components";
import useGlobal from "core/globals";
import { getServices } from "services/api/services.api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

type Service = {
    id: string;
    // agrega aquí lo que uses en ServiceItem si quieres tipado fuerte
    [key: string]: any;
};

type ListItem = Service | { _type: "empty"; id: string };

export default function ServicesCategory() {
    const params = useLocalSearchParams();
    const nameParam = (params?.name ?? "") as string;

    const navigation = useNavigation();
    const token = useGlobal((state) => state.token);

    const [services, setServices] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(false);

    const title = useMemo(() => {
        const str = (nameParam || "").trim();
        if (!str) return "Categoría";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }, [nameParam]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation, title]);

    const fetchData = useCallback(async () => {
        try {
            if (!token) return;

            setLoading(true);

            const res = await getServices(token, nameParam);
            const list: ListItem[] = (res?.services ?? []) as Service[];

            // si es impar, agregamos un item vacío para completar el grid
            if (list.length % 2 !== 0) {
                list.push({ _type: "empty", id: "empty-0" });
            }

            setServices(list);
        } catch (error: any) {
            Alert.alert("Error", error?.message ?? "Ocurrió un error al cargar los servicios.");
        } finally {
            setLoading(false);
        }
    }, [token, nameParam]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <View className="flex pb-[70px] h-full flex-col items-center justify-center">
                <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
            </View>
        );
    }

    return (
        <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 8,
                paddingTop: 16,
                paddingBottom: 32,
                flexGrow: 1,
            }}
            columnWrapperStyle={{
                gap: 16,
            }}
            renderItem={({ item }) =>
                "_type" in item && item._type === "empty" ? (
                    <View className="flex-1 h-32" />
                ) : (
                    <View style={{
                        flex: 1,
                        marginBottom: 16, // 👈 ESTO es el padding en Y real
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                    }}>
                        <ServiceItem item={item as Service} />
                    </View>
                )
            }
            // opcional: mejora performance si hay muchos items
            initialNumToRender={8}
            windowSize={7}
            removeClippedSubviews
        />
    );
}