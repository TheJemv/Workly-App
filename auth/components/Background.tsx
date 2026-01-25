import { Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Background = () => (
    <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
    }}>
        <Image
            source={require('assets/adaptive-icon.png')}
            style={{ width: 160, height: 160 }}
            resizeMode="cover"
        />
    </SafeAreaView >
)

export default Background