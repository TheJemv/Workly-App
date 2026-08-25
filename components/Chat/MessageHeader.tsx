import { View, Text } from 'react-native'
import { memo } from 'react'
import { Image } from 'expo-image'

const MessageHeader = memo(({ friend }: any) => {
    const user = friend?.profile

    return (
        <View className="flex-1 flex-row items-center">
            <Image source={{ uri: user?.photo }} className="w-8 h-8 rounded-full" />
            <Text className="text-dark ml-2.5 text-base font-bold">{user?.name || 'Usuario'}</Text>
        </View>
    )
})

export default MessageHeader