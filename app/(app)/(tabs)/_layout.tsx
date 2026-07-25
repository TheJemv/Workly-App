import { Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from 'lib';
import { AuthContext } from 'context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const ICONS_SIZE = 28;

export default function AppLayout() {
    const { customer } = useContext(AuthContext)!;
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const protectedListener = {
        tabPress: (e: any) => {
            if (!customer) {
                e.preventDefault();
                router.replace('/(auth)');
            }
        }
    };

    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Tabs
                initialRouteName='(home)'
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: Colors.principal[400],
                    tabBarInactiveTintColor: "#858585",
                    tabBarIconStyle: { fontSize: 102 },
                    tabBarStyle: {
                        paddingBottom: Platform.OS === "android" ? insets.bottom + 8 : 8,
                        paddingTop: 8,
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                        height: Platform.OS === "android" ? 60 + insets.bottom : 70,
                        paddingHorizontal: 12,
                        backgroundColor: Colors.white,
                    },
                    tabBarItemStyle: { paddingVertical: 4 },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{ href: null, tabBarIcon: () => null }}
                />
                <Tabs.Screen name='(home)' options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='home' size={ICONS_SIZE} color={color} />
                    )
                }} />
                <Tabs.Screen
                    name='(orders)'
                    listeners={protectedListener}
                    options={{
                        title: "Ordenes",
                        tabBarIcon: ({ color }) => (
                            <Ionicons name='bag' size={ICONS_SIZE} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='(messages)'
                    listeners={protectedListener}
                    options={{
                        title: "Mensajes",
                        tabBarIcon: ({ color }) => (
                            <Ionicons name='chatbubble' size={ICONS_SIZE} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='(company)'
                    listeners={protectedListener}
                    options={{
                        title: "Empresa",
                        tabBarIcon: ({ color }) => (
                            <Ionicons name='prism' size={ICONS_SIZE} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='(user)'
                    listeners={protectedListener}
                    options={{
                        title: "Usuario",
                        tabBarIcon: ({ color }) => (
                            <Ionicons name='settings' size={ICONS_SIZE} color={color} />
                        )
                    }}
                />
            </Tabs>
        </React.Fragment>
    );
}