import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import CustomBackButton from "components/Header/CustomBackButton"

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
            </Stack>
        </React.Fragment>
    )
}