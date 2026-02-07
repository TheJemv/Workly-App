import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Stack } from 'expo-router'
import useGlobal from 'core/globals'
import CustomBackButton from 'components/Header/CustomBackButton'

export default function CompanyLayout() {
    const company = useGlobal(s => s.company)
    return (
        <React.Fragment>
            <StatusBar style='auto' />

            <Stack
                screenOptions={{
                    headerShown: false,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: "transparent",
                    }
                }}
            >
                <Stack.Protected guard={!company}>
                    <Stack.Screen name='index' />
                    <Stack.Screen
                        name='request'
                        options={{
                            presentation: "modal",
                            headerShown: true,
                            title: "Solicitud de Empresa",
                            headerTransparent: true
                        }}
                    />
                </Stack.Protected>

                <Stack.Protected guard={!!company}>
                    <Stack.Screen name='company' />
                    <Stack.Screen name='edit' options={{ headerShown: true, title: "Editar", headerLeft: () => <CustomBackButton /> }} />
                    <Stack.Screen name='service-create' options={{ headerShown: true, title: "Agregar Servicio", headerLeft: () => <CustomBackButton /> }} />
                    <Stack.Screen name='service-edit' options={{ headerShown: true, title: "Editar Servicio", headerLeft: () => <CustomBackButton /> }} />
                    <Stack.Screen name='(edit)' />
                </Stack.Protected>
            </Stack>
        </React.Fragment>
    )
}