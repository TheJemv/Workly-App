import { FlatList, Text, View, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useCallback } from 'react'
import useGlobal from 'core/globals'
import ChatItem from 'components/ChatItem'
import NotFoundScreen from 'components/NotFoundScreen'

export default function MessagesIndex() {
    const chats = useGlobal(s => s.chats)
    const getChats = useGlobal(s => s.getChats) // la función que recarga los chats
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await getChats()
        setRefreshing(false)
    }, [getChats])

    if (!chats) return <NotFoundScreen />

    return chats.length !== 0 ? (
        <FlatList
            className='flex-1'
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ChatItem data={item} />}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    ) : (
        <View className='flex-1 items-center justify-center px-6'>
            <Image
                source={require("assets/Empty/InboxEmpty.png")}
                style={{ width: 200, height: 200 }}
                contentFit='contain'
            />
            <View className="mt-8">
                <Text className="text-gray-800 text-xl font-semibold text-center mb-1">
                    Espera tu primer mensaje.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Aqui te llegara tu primer mensaje cuando hagas tu primera compra o venta.
                </Text>
            </View>
        </View>
    )
}