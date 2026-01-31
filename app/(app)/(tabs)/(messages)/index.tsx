import { FlatList, ScrollView, Text } from 'react-native'
import React from 'react'
import useGlobal from 'core/globals'
import ChatItem from 'components/ChatItem'

export default function MessagesIndex() {
    const chats = useGlobal(s => s.chats)

    return (
        <ScrollView className='flex-1'>
            <FlatList
                data={chats}
                scrollEnabled={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ChatItem data={item} />}
            />
        </ScrollView>
    )
}