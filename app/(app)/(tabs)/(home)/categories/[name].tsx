import { View, FlatList, Alert } from "react-native";

import { ServiceItem } from "components/Home/ServicesTrending/components";
import { useEffect, useLayoutEffect, useState } from "react";
import useGlobal from "core/globals";
import { getServices } from "services/api/services.api";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

export default function ServicesCategory() {
    const params = useLocalSearchParams()

    const { name } = params;
    const navigation = useNavigation();
    const token = useGlobal((state) => state.token);

    const [services, setServices] = useState<any[] | null>(null);
    const [loading, setLoading] = useState<boolean>();

    const capitalize = (str: string) => {
        if (!str) return ""; // Evita errores si llega null o undefined
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: capitalize(name as string),
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let dataToRender = [];
                await getServices(token, name as string).then((data) => {
                    dataToRender = data.services;
                });

                if (dataToRender.length % 2 !== 0) {
                    dataToRender.push("empty");
                }

                setServices(dataToRender);
            } catch (error) {
                Alert.alert("Error", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return loading || !services ? (
        <View className="flex pb-[70px] h-full flex-col items-center justify-center">
            <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
        </View>
    ) : (
        <FlatList
            data={services}
            keyExtractor={(item) => item.id || item.toString()}
            numColumns={2}
            scrollEnabled={true}
            contentContainerStyle={{
                gap: 16,
                flex: 1,
                paddingHorizontal: 8
            }}
            renderItem={({ item }) =>
                item === "empty" ? (
                    <View className="flex-1 h-32 p-4" />
                ) : (
                    <View key={item.id} className="flex-1 rounded-lg justify-center items-center">
                        <ServiceItem key={item.id} item={item} />
                    </View>
                )
            }
        />
    );
}
