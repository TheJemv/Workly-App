import { View, ScrollView, Image, Text } from 'react-native'
import React, { useEffect } from 'react'
import useGlobal from 'core/globals';
import { FlatList } from 'react-native-gesture-handler';
import { OrderCard } from 'components/TrackOrderScreen/order-card';
import { Order } from '@/types/Order';
import { router } from 'expo-router';
import NotFoundScreen from 'components/NotFoundScreen';

const ImageOrdersEmpty = require("assets/Empty/OrdersEmpty.png")

export default function OrdersIndex() {
    const handleOrder = (data) => {
        router.push({
            pathname: "/(orders)/order",
            params: {
                ...data
            }
        })
    }

    // Variables globales
    const customer = useGlobal((state) => state.customer);
    const orders = useGlobal((state) => state.orders);

    // Funciones globales
    const getOrders = useGlobal((state) => state.getOrders);

    // Efectos
    useEffect(() => {
        if (customer) {
            getOrders();
        }
    }, [customer]);


    if (!orders || !orders.data) return <NotFoundScreen />
    return orders.data.length !== 0 ? (
        <ScrollView>
            <FlatList
                data={orders?.data?.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )}
                keyExtractor={(item: Order) => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => handleOrder(item)}
                    />
                )}
                scrollEnabled={false}
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
                    No tienes ninguna orden.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Haz tu primera orden ya, mira los servicios populares.
                </Text>
            </View>
        </View>
    )
}