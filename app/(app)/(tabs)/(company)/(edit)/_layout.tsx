import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import CustomBackButton from 'components/Header/CustomBackButton'

export default function Layout() {
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: "transparent"
                    }
                }}
            >
                <Stack.Screen name='schedule' options={{ title: "Editar Horarios", headerLeft: () => <CustomBackButton /> }} />
                <Stack.Screen name='option' options={{ title: "Opcion", headerLeft: () => <CustomBackButton /> }} />


                <Stack.Screen name='onboarding' options={{ title: "Status del Onboarding", headerLeft: () => <CustomBackButton /> }} />
                <Stack.Screen name='onboarding-information' options={{
                    title: "Error en Validaciones",
                    headerLeft: () => <CustomBackButton />,
                    presentation: "modal",
                }} />
            </Stack>
        </React.Fragment>
    )
}