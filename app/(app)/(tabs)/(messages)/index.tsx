import { FlatList, Image, ScrollView, Text, View } from 'react-native'
import React from 'react'
import useGlobal from 'core/globals'
import ChatItem from 'components/ChatItem'
import NotFoundScreen from 'components/NotFoundScreen'

const SalesOrdersEmpty = require("assets/Empty/InboxEmpty.png")
export default function MessagesIndex() {
    const chats = useGlobal(s => s.chats)

    if (!chats) return <NotFoundScreen />
    return chats.length !== 0 ? (
        <ScrollView className='flex-1'>
            <FlatList
                data={chats}
                scrollEnabled={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ChatItem data={item} />}
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
                    Espera tu primer mensaje.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Aqui te llegara tu primer mensaje cuando hagas tu primera compra o venta.
                </Text>
            </View>
        </View>
    )
}