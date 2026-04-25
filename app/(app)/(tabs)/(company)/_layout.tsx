import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Stack } from 'expo-router'
import useGlobal from 'core/globals'
import CustomBackButton from 'components/Header/CustomBackButton'
import { COLOR_BACKGROUND } from 'constants/index'

export default function CompanyLayout() {
    const company = useGlobal(s => s.company)
    console.log(company)
    return (
        <React.Fragment>
            <StatusBar style='auto' />

            <Stack
                screenOptions={{
                    headerShown: false,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: COLOR_BACKGROUND,
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
                    <Stack.Screen
                        name='service-provider-contract'
                        options={{
                            presentation: "modal",
                            headerShown: true,
                            title: "Terminos de Empresas"
                        }}
                    />
                </Stack.Protected>

                <Stack.Protected guard={!!company}>
                    <Stack.Screen name='company' options={{ headerShown: true, title: "Empresa" }} />
                    <Stack.Screen name='edit' options={{ headerShown: true, title: "Editar", headerLeft: () => <CustomBackButton /> }} />
                    <Stack.Screen name='service-create' options={{ headerShown: true, title: "Agregar Servicio", headerLeft: () => <CustomBackButton /> }} />
                    <Stack.Screen name='service-edit' options={{ headerShown: true, title: "Editar Servicio", headerLeft: () => <CustomBackButton /> }} />
                    <Stack.Screen name='(edit)' />
                </Stack.Protected>
            </Stack>
        </React.Fragment>
    )
}