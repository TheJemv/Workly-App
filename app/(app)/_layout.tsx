import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { router, Stack } from "expo-router";
import CustomBackButton from "components/Header/CustomBackButton";
import * as Notifications from "expo-notifications";
import { COLOR_BACKGROUND } from "constants/index";

// 👇 Esto ayuda muchísimo para deep links / notificaciones
export const unstable_settings = {
    initialRouteName: "(tabs)",
};

function useNotificationNavigation() {
    useEffect(() => {
        const go = (data: any) => {
            if (!data) return;
            if (data.type === "message" && data.roomId) {
                router.push({
                    pathname: "/chat",
                    params: { roomId: String(data.roomId) },
                });
            }
            if ((data.type === "order" || data.type === "sale") && data.orderId) {
                router.push({
                    pathname: "/order",
                    params: { orderId: String(data.orderId) },
                });
            }
        };
        const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
            go(resp.notification.request.content.data);
        });
        (async () => {
            const last = await Notifications.getLastNotificationResponseAsync();
            go(last?.notification.request.content.data);
        })();

        return () => sub.remove();
    }, []);
}

export default function LayoutApp() {
    useNotificationNavigation();
    return (
        <>
            <StatusBar style="auto" />

            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(tabs)" />

                <Stack.Screen
                    name="chat"
                    options={{
                        headerShown: true,
                        headerLeft: () => <CustomBackButton />,
                    }}
                />

                <Stack.Screen
                    name="order"
                    options={{
                        headerShown: true,
                        title: "Detalles de la Orden",
                        headerLeft: () => <CustomBackButton />,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: COLOR_BACKGROUND,
                        },
                    }}
                />
            </Stack>
        </>
    );
}