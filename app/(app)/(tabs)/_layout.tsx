import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from 'lib';

const ICONS_SIZE = 28

export default function AppLayout() {
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Tabs
                initialRouteName='(home)'
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: Colors.principal[500],
                    tabBarInactiveTintColor: "#858585",
                    tabBarIconStyle: {
                        fontSize: 102
                    },
                    tabBarStyle: {
                        paddingBottom: 8,        // ✅ Padding interno
                        paddingTop: 8,           // ✅ Padding superior
                        borderTopWidth: 0,       // ✅ Sin borde superior
                        elevation: 0,            // ✅ Sin sombra (Android)
                        shadowOpacity: 0,        // ✅ Sin sombra (iOS)
                    },
                    tabBarItemStyle: {
                        paddingVertical: 4,      // ✅ Espacio vertical para íconos
                    },
                }}
            >
                <Tabs.Screen name='(home)' options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='home' size={ICONS_SIZE} color={color} />
                    )
                }} />

                <Tabs.Screen name='(orders)' options={{
                    title: "Ordenes",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='bag' size={ICONS_SIZE} color={color} />
                    )
                }} />

                <Tabs.Screen name='(messages)' options={{
                    title: "Mensajes",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='chatbubble' size={ICONS_SIZE} color={color} />
                    )
                }} />

                <Tabs.Screen name='(company)' options={{
                    title: "Empresa",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='prism' size={ICONS_SIZE} color={color} />
                    )
                }} />

                <Tabs.Screen name='(user)' options={{
                    title: "Usuario",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='settings' size={ICONS_SIZE} color={color} />
                    )
                }} />
            </Tabs>
        </React.Fragment>
    );
}