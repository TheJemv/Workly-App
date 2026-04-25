import { memo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { Image } from 'expo-image'
import { router } from 'expo-router'

import { Colors } from 'lib';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from "@expo/vector-icons/Ionicons";

const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "code",
});

const fromStripe = (amount: number) => formatter.format(amount / 100);
const ServiceBubble = memo(({ order, uid }: any) => (
    <View className="flex flex-row p-0.5 px-3 my-2">
        {order.customer.uid === uid && <View className='flex-1' />}
        {/* Este view tiene el shadow pero SIN overflow hidden */}
        <View style={{
            width: 240,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            backgroundColor: '#fff',
        }}>
            {/* Este view tiene overflow hidden para recortar la imagen */}
            <View style={{ borderRadius: 12, overflow: 'hidden' }}>
                <Image source={{ uri: order.servicePhoto }} style={{ width: '100%', height: 180 }} />
                <View style={{ backgroundColor: '#fff', padding: 12, gap: 4 }}>
                    <View className='flex flex-row' style={{ gap: 4 }}>
                        <View className='flex flex-col items-center justify-center h-[36px] w-[36px] rounded-md' style={{ backgroundColor: Colors.principal[50] }}>
                            <MaterialIcons name="miscellaneous-services" size={24} color={Colors.principal.DEFAULT} />
                        </View>

                        <View className='flex flex-col' style={{ gap: 0, flex: 1 }}>
                            <Text numberOfLines={1} className='font-semibold'>{order.serviceName}</Text>
                            <Text className='font-light' style={{ color: Colors.principal.DEFAULT }}>{fromStripe(order.serviceUnit_amount)}</Text>
                        </View>
                    </View>

                    {/* Customer */}
                    <View className='w-full flex flex-row items-center justify-between py-1'>
                        <View className='flex flex-row items-center' style={{ gap: 2 }}>
                            <Image source={{ uri: order.customer.profile.photo }} style={{ width: 24, height: 24, borderRadius: 999 }} />
                            <Text className='text-xs text-[#808080]'>{order.customer.profile.name}</Text>
                        </View>

                        <View className='flex flex-row items-center' style={{ gap: 2 }}>
                            <Ionicons name="time-outline" size={18} color="#808080" />
                            <Text className='text-[#808080] text-xs'>27 Feb</Text>
                        </View>
                    </View>

                    {/* Boton */}
                    <TouchableOpacity
                        style={{ backgroundColor: '#181818', paddingVertical: 6, borderRadius: 8 }}
                        onPress={() => router.push({ pathname: `/(app)/order`, params: order })}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 14, color: '#fff' }}>Ver orden</Text>
                            <Ionicons size={18} name='chevron-forward' color="#ffffff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
))

export default ServiceBubble