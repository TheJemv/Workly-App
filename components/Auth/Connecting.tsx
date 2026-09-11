import { StatusBar, Image, View, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'lib'

const LOGO_SIZE = 160;
// Un poco más grande que el logo para dejarle aire dentro de la tarjeta redondeada.
const CARD_SIZE = LOGO_SIZE + 16;
const CARD_RADIUS = 36;

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
            {/*
             * Dos Views separadas a propósito: en RN un mismo View no puede
             * recortar su contenido (overflow: hidden) Y proyectar una sombra al
             * mismo tiempo (la sombra se recorta/desaparece con él). Antes este
             * wrapper hacía ambas cosas a la vez con `flex: 1` (sin tamaño fijo),
             * así que en vez de una tarjeta chica con sombra se veía una caja
             * gigante con el fondo blanco de `adaptive-icon.png` y la sombra
             * saliendo de esa caja.
             *
             * Ahora: la de afuera (tamaño fijo) solo pone la sombra, la de
             * adentro solo recorta el logo en una tarjeta redondeada.
             */}
            <View style={{
                width: CARD_SIZE,
                height: CARD_SIZE,
                borderRadius: CARD_RADIUS,
                backgroundColor: '#fff',

                elevation: isAndroid ? 0 : 8,
                shadowColor: !isAndroid ? Colors.principal.DEFAULT : undefined,
                shadowOffset: !isAndroid ? { width: 0, height: 4 } : undefined,
                shadowOpacity: !isAndroid ? 0.3 : undefined,
                shadowRadius: !isAndroid ? 8 : undefined,
            }}>
                <View style={{
                    flex: 1,
                    borderRadius: CARD_RADIUS,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        source={require('assets/adaptive-icon.png')}
                        style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}