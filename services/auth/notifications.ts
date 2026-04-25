import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import apiClient from "services/api/apiClient";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { Platform } from "react-native";

export async function getExpoPushToken(): Promise<string | null> {
    console.log("Device.isDevice:", Device.isDevice);

    const perms = await Notifications.getPermissionsAsync();
    console.log("permiso actual:", perms.status);

    if (!Device.isDevice) return null;

    if (perms.status !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        console.log("permiso pedido:", req.status);
        if (req.status !== "granted") return null;
    }

    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

    console.log("projectId:", projectId);

    try {
        const expoToken = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log("✅ expoPushToken:", expoToken.data); // 👈 ESTO
        return expoToken.data;
    } catch (e: any) {
        console.log("❌ getExpoPushTokenAsync error:", e?.message ?? e, e);
        return null;
    }
}

export function usePushTokenSync() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;

        const syncToken = async () => {
            try {
                const pushToken = await getExpoPushToken();
                if (!pushToken) return;

                await apiClient.put("/notifications/token", {
                    token: pushToken,
                    platform: Platform.OS,
                    deviceId: pushToken
                }).then(() => {
                    console.log("✅ Push token sincronizado");
                })
            } catch (e) {
                console.warn("⚠️ No se pudo sincronizar push token:", e);
            }
        };

        syncToken();
    }, [isLoggedIn]);
}