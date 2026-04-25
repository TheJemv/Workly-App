import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Image } from 'react-native'
import { ordersHistory } from 'services/api/orders.api'
import { router, useFocusEffect, useNavigation } from 'expo-router'
import { OrderCard } from 'components/TrackOrderScreen/order-card'
import { AntDesign } from "@expo/vector-icons";
import { Colors } from 'lib'
import SpinLoading from 'components/SpinLoading'

const ImageOrdersEmpty = require("assets/Empty/OrdersEmpty.png")

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const navigation = useNavigation()

    const handleOrder = (data: any) => {
        router.push({
            pathname: "/(app)/order",
            params: { ...data }
        })
    }

    const reloadHistory = useCallback(async () => {
        try {
            setLoading(true);
            setPage(1);
            const res = await ordersHistory(1);
            setHistory(res.data);
            setHasNextPage(res.meta.hasNextPage);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = async () => {
        if (loadingMore || !hasNextPage) return;
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const res = await ordersHistory(nextPage);
            setHistory(prev => [...prev, ...res.data]);
            setPage(nextPage);
            setHasNextPage(res.meta.hasNextPage);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoadingMore(false);
        }
    };

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

    if (loading) return <SpinLoading size={32} />
    if (history.length === 0) return (
        <View className='flex-1 items-center justify-center px-6'>
            <Image
                source={ImageOrdersEmpty}
                style={{ width: 200, height: 200 }}
                resizeMode='contain'
            />
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

    return (
        <FlatList
            data={history}
            renderItem={({ item }) => (
                <OrderCard order={item} onPress={() => handleOrder(item)} />
            )}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                gap: 12,
                paddingBottom: 32
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
                loadingMore ? (
                    <View className="py-4 items-center">
                        <SpinLoading />
                    </View>
                ) : null
            }
        />
    )
}