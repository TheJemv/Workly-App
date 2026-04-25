import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import CustomBackButton from "components/Header/CustomBackButton"
import { COLOR_BACKGROUND } from "constants/index";


export default function UserLayout() {
    return (
        <React.Fragment>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: COLOR_BACKGROUND,
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

                <Stack.Screen name="verify-phone" options={{
                    headerShown: true,
                    headerTitle: "Verificar Telefono",
                    headerLeft: () => <CustomBackButton />,
                }} />

                <Stack.Screen name="verify-code" options={{
                    headerShown: true,
                    headerTitle: "Verificar Telefono",
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

                {/* Delete Account */}
                <Stack.Screen name="delete-account" options={{
                    headerShown: true,
                    headerTitle: "Borrar Cuenta",
                    headerLeft: () => <CustomBackButton />,
                }} />
            </Stack>
        </React.Fragment>
    )
}