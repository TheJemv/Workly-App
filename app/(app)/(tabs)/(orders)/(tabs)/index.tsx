import { View, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import useGlobal from 'core/globals';
import { FlatList } from 'react-native-gesture-handler';
import { OrderCard } from 'components/TrackOrderScreen/order-card';
import SpinLoading from 'components/SpinLoading';
import { Colors } from 'lib';
import { Order } from '@/types/Order';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    return orders !== null ? (
        orders?.loaded ? (
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
                    }}
                    ListFooterComponent={() => <View className="my-4" />}
                />
            </ScrollView>
        ) : (
            <SpinLoading size={48} color={Colors.principal.DEFAULT} />
        )
    ) : (
        <View className="flex-1">
            <SpinLoading size={48} color={Colors.principal.DEFAULT} />
        </View>
    )
}