import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import CustomBackButton from "components/Header/CustomBackButton"
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function UserLayout() {
    return (
        <React.Fragment>
            <StatusBar style="auto" />

            <Stack
                screenOptions={{
                    headerShown: false,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: "transparent",
                    }
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="profile" options={{
                    headerShown: true,
                    headerTitle: "Perfil",
                    headerLeft: () => <CustomBackButton />,
                }} />

                <Stack.Screen name="support" options={{
                    headerShown: true,
                    headerTitle: "Soporte",
                    headerLeft: () => <CustomBackButton />,
                }} />

                <Stack.Screen name="history" options={{
                    headerShown: true,
                    headerTitle: "Historial de Ordenes",
                    headerLeft: () => <CustomBackButton />,
                }} />


                {/* Billing */}
                <Stack.Screen name="billing/index" options={{
                    headerShown: true,
                    headerTitle: "Facturacion",
                    headerLeft: () => <CustomBackButton />,
                }} />

                <Stack.Screen name="billing/create" options={{
                    headerShown: true,
                    headerTitle: "Crear Datos",
                    headerLeft: () => <CustomBackButton />,
                }} />

                <Stack.Screen name="billing/edit" options={{
                    headerShown: true,
                    headerTitle: "Editar Datos",
                    headerLeft: () => <CustomBackButton />,
                }} />

                {/* Locations */}
                <Stack.Screen name="location/index" options={{
                    headerShown: true,
                    headerTitle: "Direcciones",
                    headerLeft: () => <CustomBackButton />,
                }} />

                <Stack.Screen name="location/create" options={{
                    headerShown: true,
                    headerTitle: "Seleccionar Ubicacion",
                    headerTransparent: true,
                    headerLeft: () => <CustomBackButton />,
                }} />
            </Stack>
        </React.Fragment>
    )
}