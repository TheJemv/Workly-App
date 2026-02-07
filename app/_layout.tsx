import { useContext, useEffect, useRef, useState } from 'react';
import { AppState, View, StyleSheet } from 'react-native';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import useGlobal from "../core/globals";
import { Background, Connecting, Disconnected } from "../components/Auth";
import { PUBLISHABLE_KEY } from "@env";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const SwitchAuth = () => {
    const router = useRouter();
    const segments = useSegments();
    const { token, loading } = useContext(AuthContext);
    const socketStatus = useGlobal((s) => s.socketStatus);
    const onAppForeground = useGlobal((s) => s.onAppForeground);
    const [appState, setAppState] = useState(AppState.currentState);
    const appStateRef = useRef(AppState.currentState);

    useEffect(() => {
        const sub = AppState.addEventListener("change", (nextAppState) => {
            const previousAppState = appStateRef.current;
            appStateRef.current = nextAppState;
            setAppState(nextAppState);
            if (
                nextAppState === "active" &&
                (previousAppState === "background" || previousAppState === "inactive")
            ) {
                console.log("📱 App volvió a foreground, reconectando...");
                onAppForeground();
            }
        });
        return () => sub.remove();
    }, [onAppForeground]);

    // Navegación basada en auth
    useEffect(() => {
        if (!loading) return; // Esperar a que auth esté lista

        const inAuthGroup = segments[0] === '(auth)';
        const inAppGroup = segments[0] === '(app)';

        if (!token && !inAuthGroup) {
            console.log("🔴 No token - redirigiendo a auth");
            router.replace('/(auth)');
        } else if (token && socketStatus === "connected" && !inAppGroup) {
            console.log("🟢 Token + conectado - redirigiendo a app");
            router.replace('/(app)/(home)');
        }
    }, [token, loading, socketStatus, segments]);

    // Determinar qué mostrar
    let showOverlay = null;

    if (appState === "background" || appState === "inactive") {
        showOverlay = <Background />;
    } else if (!loading) {
        showOverlay = <Connecting />;
    } else if (token && socketStatus === "disconnected") {
        showOverlay = <Disconnected />;
    } else if (token && socketStatus === "connecting") {
        showOverlay = <Connecting />;
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={!token && socketStatus == "disconnected"}>
                    <Stack.Screen options={{ animation: "none" }} name="(auth)" />
                </Stack.Protected>

                <Stack.Protected guard={!!token && socketStatus == "connected"}>
                    <Stack.Screen options={{ animation: "none" }} name="(app)" />
                </Stack.Protected>
            </Stack>

            {showOverlay && (
                <View style={StyleSheet.absoluteFill}>
                    {showOverlay}
                </View>
            )}
        </>
    );
};

function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <StripeProvider publishableKey={PUBLISHABLE_KEY}>
                    <AuthProvider>
                        <SwitchAuth />
                    </AuthProvider>
                </StripeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

export default RootLayout