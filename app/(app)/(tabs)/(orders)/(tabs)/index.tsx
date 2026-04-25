import { View, Image, Text } from 'react-native'
import React, { useEffect } from 'react'
import useGlobal from 'core/globals';
import { FlatList } from 'react-native-gesture-handler';
import { OrderCard } from 'components/TrackOrderScreen/order-card';
import { Order } from '@/types/Order';
import { router } from 'expo-router';
import NotFoundScreen from 'components/NotFoundScreen';
import SpinLoading from 'components/SpinLoading';

const ImageOrdersEmpty = require("assets/Empty/OrdersEmpty.png")

export default function OrdersIndex() {
    const orders = useGlobal((state) => state.orders);
    const getOrders = useGlobal((state) => state.getOrders);

    const handleOrder = (data: any) => {
        router.push({
            pathname: "/(app)/order",
            params: { ...data }
        });
    };

    const loadMore = () => {
        if (!orders?.meta?.hasNextPage) return;
        const nextPage = (orders.meta.page ?? 1) + 1;
        console.log("📦 Cargando página:", nextPage);
        getOrders(nextPage);
    };

    if (!orders) return <NotFoundScreen />
    if (!orders.loaded && orders.data.length === 0) return <SpinLoading />

    return orders.data.length !== 0 ? (
        <FlatList
            data={orders.data}
            keyExtractor={(item: Order) => item.id}
            renderItem={({ item }) => (
                <OrderCard
                    order={item}
                    onPress={() => handleOrder(item)}
                />
            )}
            contentContainerStyle={{
                paddingVertical: 8,
                gap: 12,
                paddingBottom: 32,
                paddingHorizontal: 12
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
                orders?.meta?.hasNextPage
                    ? <Text className="text-center py-4 text-gray-400">Cargando más...</Text>
                    : null
            }
        />
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
                    No tienes ninguna orden.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Haz tu primera orden ya, mira los servicios populares.
                </Text>
            </View>
        </View>
    );
}