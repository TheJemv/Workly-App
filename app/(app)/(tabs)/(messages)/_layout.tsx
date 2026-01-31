import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import CustomBackButton from 'components/Header/CustomBackButton'

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