import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { View, FlatList, Alert, Text, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

import { getServices } from "services/api/services.api";
import { getUserMessage } from "services/api/errors";
import { CategoryServiceItem } from "components/Home/Categories/components";
import { ServiceType as Service } from "components/Home/ServicesTrending/types";
import { COLOR_BACKGROUND } from "constants/index";

function CategorySkeleton() {
    const opacity = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.45, duration: 750, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [opacity]);

    return (
        <Animated.View style={{ opacity, gap: 12 }}>
            {[0, 1, 2, 3].map((i) => (
                <View
                    key={i}
                    style={{
                        flexDirection: "row",
                        gap: 12,
                        padding: 10,
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        alignItems: "center",
                    }}
                >
                    <View style={{ width: 104, height: 88, borderRadius: 12, backgroundColor: "#e6e6ea" }} />
                    <View style={{ flex: 1, gap: 8 }}>
                        <View style={{ width: "70%", height: 12, borderRadius: 6, backgroundColor: "#e6e6ea" }} />
                        <View style={{ width: "40%", height: 10, borderRadius: 6, backgroundColor: "#e6e6ea" }} />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}

export default function ServicesCategory() {
    const params = useLocalSearchParams();
    const nameParam = (params?.name ?? "") as string;

    const navigation = useNavigation();

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const title = useMemo(() => {
        const str = (nameParam || "").trim();
        if (!str) return "Categoría";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }, [nameParam]);

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: title });
    }, [navigation, title]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getServices(nameParam);
            setServices((res?.services ?? []) as Service[]);
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        } finally {
            setLoading(false);
        }
    }, [nameParam]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <View style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }}>
            <FlatList
                data={loading ? [] : services}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CategoryServiceItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 12, gap: 12, flexGrow: 1 }}
                initialNumToRender={8}
                windowSize={7}
                removeClippedSubviews
                ListHeaderComponent={
                    !loading && services.length > 0 ? (
                        <Text className="text-text text-[13px]" style={{ paddingHorizontal: 4 }}>
                            {`${services.length} ${services.length === 1 ? "servicio" : "servicios"} disponibles`}
                        </Text>
                    ) : null
                }
                ListEmptyComponent={
                    loading ? (
                        <CategorySkeleton />
                    ) : (
                        <View
                            className="flex-1 items-center justify-center px-8"
                            style={{ gap: 10, paddingTop: 72 }}
                        >
                            <Image
                                source={require("assets/Empty/ServiceNotFound.png")}
                                style={{ width: 120, height: 100 }}
                                resizeMode="contain"
                            />
                            <Text className="text-dark font-semibold text-base text-center">
                                Nada por aquí todavía
                            </Text>
                            <Text className="text-text text-[13px] text-center">
                                Por el momento no hay servicios disponibles en {title}.
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
}
