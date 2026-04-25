import { StatusBar, Image, View, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'lib'

export default function Connecting() {
    const isAndroid = Platform.OS === "android";
    return (
        <SafeAreaView style={{
            flex: 1,
            marginTop: StatusBar.currentHeight,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 24,
            backgroundColor: "#fff"
        }}>
            <View style={{
                borderRadius: 70,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,

                elevation: isAndroid ? 0 : 8,
                shadowColor: !isAndroid && Colors.principal.DEFAULT,
                shadowOffset: !isAndroid && { width: 0, height: 4 },
                shadowOpacity: !isAndroid && 0.3,
                shadowRadius: !isAndroid && 8,
            }}>
                <Image
                    source={require('assets/adaptive-icon.png')}
                    style={{ width: 160, height: 160 }}
                    resizeMode="cover"
                />
            </View>
        </SafeAreaView>
    )
}