import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

export default function LayoutApp() {
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Stack
                initialRouteName='(tabs)'
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name='(tabs)' />
                <Stack.Screen name='chat' options={{ headerShown: true, }} />
            </Stack>
        </React.Fragment>
    )
}