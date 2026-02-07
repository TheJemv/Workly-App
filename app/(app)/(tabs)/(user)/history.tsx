import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import LoadingScreen from 'components/LoadingScreen'
import { Image } from 'react-native'
import { ordersHistory } from 'services/api/orders.api'
import { useFocusEffect, useNavigation } from 'expo-router'
import { OrderCard } from 'components/TrackOrderScreen/order-card'
import { AntDesign } from "@expo/vector-icons";
import { Colors } from 'lib'

const ImageOrdersEmpty = require("assets/Empty/OrdersEmpty.png")

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState<boolean>(false)
    const navigation = useNavigation()

    const reloadHistory = useCallback(async () => {
        try {
            setLoading(true);
            const res = await ordersHistory();
            setHistory(res.data);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false)
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            reloadHistory();
        }, [reloadHistory])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    className='flex ml-1.5'
                    onPress={reloadHistory}
                    style={{ height: '100%' }}
                    disabled={loading}
                >
                    <AntDesign
                        color={Colors.principal.DEFAULT}
                        name="reload"
                        size={24}
                    />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    return history.length !== 0 || !loading ? (
        <ScrollView>
            <FlatList
                scrollEnabled={false}
                data={history}
                renderItem={({ item }) => <OrderCard order={item} />}
                contentContainerStyle={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    gap: 12,
                    paddingBottom: 32
                }}
            />
        </ScrollView>
    ) : (
        <View className='flex-1 items-center justify-center px-6'>
            <View>
                <Image
                    source={ImageOrdersEmpty}
                    style={{ width: 200, height: 200 }}
                    resizeMode='contain'
                />
            </View>

            <View className="mt-8">
                <Text className="text-gray-800 text-xl font-semibold text-center mb-1">
                    No tienes historial de ordenes.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Haz tu primera orden ya, mira los servicios populares.
                </Text>
            </View>
        </View>
    )
}