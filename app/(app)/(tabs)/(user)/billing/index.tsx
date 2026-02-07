import {
    ScrollView,
    View,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    Image
} from "react-native";
import { Colors } from "lib";
import { useEffect, useLayoutEffect, useState } from "react";
import Invoice from "components/Profile/Billing/components/invoice";
import { getBillings } from "services/api/billing.api";
import useGlobal from "core/globals";
import { router, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather"
import { LoadingScreen } from "components/Home";

export default function Billing() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useGlobal();
    const navigation = useNavigation()

    useEffect(() => {
        getBillings(token)
            .then((data) => {
                setData(data.data);
            })
            .catch((e) => {
                Alert.alert("Error", (e as Error).message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    className='flex ml-1'
                    onPress={() => router.push("/billing/create")}
                    style={{
                        height: '100%',
                    }}
                >
                    <Feather
                        size={28}
                        name='file-plus'
                        color={Colors.principal.DEFAULT}
                    />
                </TouchableOpacity>
            )
        })
    }, [])

    return (
        loading ? (
            <LoadingScreen />
        ) : (
            data.length === 0 ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Image
                        source={require("../../../../../assets/Empty/Billing.png")}
                        style={{ width: 200, height: 200 }}
                        resizeMode="contain"
                    />
                    <View className="mt-2">
                        <Text className="text-gray-800 text-xl font-semibold text-center mb-2">
                            No hay datos de facturación
                        </Text>
                        <Text className="text-gray-500 text-base text-center">
                            Agrega tus datos de facturación para poder generar facturas de tus compras.
                        </Text>
                    </View>
                </View>
            ) : (
                <ScrollView className="flex-1">
                    <View className="flex flex-col space-y-5 px-3 mb-20">
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <Invoice data={item} />}
                            scrollEnabled={false}
                            contentContainerStyle={{
                                paddingVertical: 8,
                                gap: 12,
                            }}
                        />
                    </View>
                </ScrollView>
            )
        )
    );
}