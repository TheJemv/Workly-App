import { View, Text } from 'react-native'
import { memo } from 'react'
import { Image } from 'expo-image'

const EmptyState = memo(() => (
    <View className="w-full flex items-center py-32">
        <Image source={require("assets/ChatImage.png")} className="w-[220px] h-[220px]" contentFit="contain" />
        <View className="flex flex-col items-center px-8 gap-y-1">
            <Text className="text-dark text-lg font-semibold">Envía y recibe mensajes</Text>
            <Text className="text-text text-center mt-2">Chatea con tus clientes de manera fácil y rápida a través de nuestra plataforma.</Text>
        </View>
    </View>
))

export default EmptyState