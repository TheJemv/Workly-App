import { View, Text, Image } from 'react-native'
import React from 'react'

const NotFound = require("assets/Empty/NotFound.png")
export default function NotFoundScreen() {
    return (
        <View className='flex-1 items-center justify-center px-6'>
            <View>
                <Image
                    source={NotFound}
                    style={{ width: 200, height: 200 }}
                    resizeMode='contain'
                />
            </View>

            <View className="mt-8">
                <Text className="text-gray-800 text-xl font-semibold text-center mb-1">
                    Error al obtener informacion.
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Recarga la aplicacion o haz un reporte de error.
                </Text>
            </View>
        </View>
    )
}