import { Image, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useGlobal from 'core/globals';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { OrderCard } from 'components/TrackOrderScreen/order-card';
import { router } from 'expo-router';
import LoadingScreen from 'components/LoadingScreen';
import NotFoundScreen from 'components/NotFoundScreen';

const SalesOrdersEmpty = require("assets/Empty/SalesEmpty.png")


export default function SalesPage() {
    const handleSale = (data) => {
        router.push({
            pathname: "/(orders)/order",
            params: {
                ...data
            }
        })
    }


    // Variables globales
    const companyData = useGlobal((state) => state.company);
    const sales = useGlobal((state) => state.sales);

    // Funciones globales
    const getSales = useGlobal((state) => state.getSales);

    useEffect(() => {
        if (companyData) {
            getSales();
        }
    }, [companyData]);

    if (!sales || !sales.data) return <NotFoundScreen />
    return sales.data.length !== 0 ? (
        <ScrollView>
            <FlatList
                data={sales?.data?.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => handleSale(item)}
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
                    source={SalesOrdersEmpty}
                    style={{ width: 200, height: 200 }}
                    resizeMode='contain'
                />
            </View>

            <View className="mt-8">
                <Text className="text-gray-800 text-xl font-semibold text-center mb-1">
                    Espera tu primera venta.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Cuando un cliente realice una orden, aparecerá aquí.
                </Text>
            </View>
        </View>
    )
}