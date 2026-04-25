import { Text, Image, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'lib'
import SpinLoading from 'components/SpinLoading'
import { STATUS_MARGIN_TOP } from 'constants/index'

export default function Connecting() {
    return (
        <SafeAreaView style={{
            flex: 1,
            marginTop: STATUS_MARGIN_TOP,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 24,
        }}>
            <View style={{
                borderRadius: 70,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 8,
                flex: 1,
                shadowColor: Colors.principal.DEFAULT,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
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