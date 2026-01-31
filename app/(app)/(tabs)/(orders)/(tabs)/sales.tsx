import { Text } from 'react-native'
import React, { useEffect } from 'react'
import useGlobal from 'core/globals';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { OrderCard } from 'components/TrackOrderScreen/order-card';
import { router } from 'expo-router';


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

    // return sales !== null ? (
    //     sales.loaded ? (
    //         <SafeAreaView className="flex-1">
    //             <ScrollView className='flex-1'>
    //                 <FlatList
    //                     data={sales?.data?.sort(
    //                         (a, b) =>
    //                             new Date(b.createdAt).getTime() -
    //                             new Date(a.createdAt).getTime()
    //                     )}
    //                     keyExtractor={(item) => item.id}
    //                     renderItem={({ item }) => (
    //                         <OrderCard
    //                             order={item}
    //                             onPress={() => handleSale(item)}
    //                         />
    //                     )}
    //                     scrollEnabled={false}
    //                     contentContainerStyle={{
    //                         paddingVertical: 8,
    //                         paddingHorizontal: 12,
    //                         gap: 12,
    //                     }}
    //                     className='flex-1'
    //                 />
    //             </ScrollView>
    //         </SafeAreaView>
    //     ) : (
    //         <SafeAreaView className="flex-1">
    //             <SpinLoading size={48} color={Colors.principal.DEFAULT} />
    //         </SafeAreaView>
    //     )
    // ) : (
    //     <SafeAreaView className="flex-1">
    //         <SpinLoading size={48} color={Colors.principal.DEFAULT} />
    //     </SafeAreaView>
    // );

    return sales !== null && (
        sales.loaded ? (
            <ScrollView className='flex-1'>
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
                    }}
                    className='flex-1'
                />
            </ScrollView>
        ) : (
            <Text>Loading</Text>
        )
    )
}