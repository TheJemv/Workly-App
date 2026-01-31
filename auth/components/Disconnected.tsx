import { Text, StatusBar, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useGlobal from 'core/globals'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Singout } from 'services/firebase/Singout';


//  Screen shown when the app is disconnected from the server and button to try reconnect
//  Show message and a button to try reconnect.
//  Message: "Parece que estás desconectado. Verifica tu conexión e intenta nuevamente."
//  Button: "Reintentar"
//  On button press, try to reconnect to the server.
export default function Disconnected() {
    const handleRetrySocket = useGlobal((s) => s.handleRetrySocket);
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 24,
            position: 'relative',
        }}>
            <View style={{
                position: 'absolute',
                top: 32 + 32,
                right: 32,
            }}>
                <TouchableOpacity onPress={() => Singout()}>
                    <AntDesign name="close" size={32} color="#ccc" />
                </TouchableOpacity>
            </View>

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 24,
            }}>
                <Image
                    source={require('assets/States/EmptyState.png')}
                    style={{ width: 240, height: 200, alignSelf: 'center' }}
                    resizeMode="contain"
                />

                <View className='flex flex-col items-center justify-center'
                    style={{ gap: 8, display: 'flex', maxWidth: 280 }}
                >
                    <Text style={{ textAlign: "center", color: "#4A4A4A", fontSize: 18, fontWeight: 600 }}>Oops!</Text>
                    <Text style={{ textAlign: "center", color: "#4A4A4A", fontSize: 18 }}>Algo mal ha pasado, pronto lo resolveremos o intenta de nuevo.</Text>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={handleRetrySocket}
                        style={{
                            marginTop: 24,
                            backgroundColor: "#1B69FD",
                            paddingVertical: 12,
                            paddingHorizontal: 72,
                            borderRadius: 999,
                            elevation: 4,

                            //  Shadow like backgroundColor
                            shadowColor: "#1B69FD",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: '600', fontSize: 18 }}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}