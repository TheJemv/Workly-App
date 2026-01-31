import { Text, StatusBar, Image, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'lib'
import SpinLoading from 'components/SpinLoading'

export default function Connecting() {
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


            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 18,
                marginTop: 24,
                paddingBottom: 12
            }}>
                <SpinLoading size={32} />
                <Text style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: Colors.principal.DEFAULT
                }}>Work It</Text>
            </View>
        </SafeAreaView>
    )
}