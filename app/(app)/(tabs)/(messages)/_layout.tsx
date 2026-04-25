import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { Colors } from 'lib'

export default function LayoutMessages() {
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Stack
                screenOptions={{
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: "transparent",
                    },
                    headerTintColor: Colors.principal.DEFAULT
                }}
            >
                <Stack.Screen name='index'
                    options={{
                        title: "Mensajes",
                    }}
                />

                {/* <Stack.Screen name='chat'
                    options={{
                        title: "Chat",
                        headerLeft: () => <CustomBackButton />
                    }}
                /> */}
            </Stack>
        </React.Fragment>
    )
}