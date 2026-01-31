import React from 'react'
import { Stack } from 'expo-router'
import CustomBackButton from 'components/Header/CustomBackButton';

export default function LayoutHome() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "transparent",
                },
            }}
        >
            <Stack.Screen name='index' />

            <Stack.Screen name='search/index' />
            <Stack.Screen name='search/results' options={{
                title: "Resultados",
                headerShown: true,
                headerLeft: () => <CustomBackButton />,
            }} />

            <Stack.Screen name='company/[id]' options={{
                title: "Empresa",
                headerShown: true,
                headerLeft: () => <CustomBackButton />,
            }} />

            <Stack.Screen name='service/[id]' options={{
                title: "Servicio",
                headerShown: true,
                headerLeft: () => <CustomBackButton />,
            }} />

            <Stack.Screen name='categories/[name]' options={{
                title: "Categorias",
                headerShown: true,
                headerLeft: () => <CustomBackButton />,
            }} />
        </Stack>
    )
}