import { useContext, useEffect } from 'react';
import { AppRegistry, LogBox, StyleSheet, View } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StripeProvider } from '@stripe/stripe-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import { Asset, useAssets } from 'expo-asset';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { AuthProvider, AuthContext } from 'context/AuthContext';
import { Connecting, Disconnected } from 'components/Auth';
import { usePushTokenSync } from 'services/auth/notifications';
import { HomeServicesData } from '@data/index';
import useGlobal from 'core/globals';
import { PUBLISHABLE_KEY } from '@env';

// --- Configuración global de la app (corre una sola vez, al cargar el módulo) ---
// Mantiene JS despierto en Android mientras Stripe procesa un pago en background.
AppRegistry.registerHeadlessTask('StripeKeepJsAwakeTask', () => async () => { });

LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

GoogleSignin.configure({
    webClientId: '642547837410-p4il9usad2705bbhf6c9g97ib1109d6d.apps.googleusercontent.com',
    iosClientId: '642547837410-nhneruejr597j58c6p1v94bfunsivv0o.apps.googleusercontent.com',
});

// Íconos de las categorías del home: se precargan para que no parpadeen al entrar.
const iconAssets = HomeServicesData.map((item) => item.Icon);

/**
 * Bloquea la navegación real con un overlay (Connecting / Disconnected) mientras
 * la sesión, el socket o los íconos del home todavía no están listos.
 */
const SwitchAuth = ({ children }: { children: React.ReactNode }) => {
    usePushTokenSync();

    const { token, loading, customer } = useContext(AuthContext)!;
    const socketStatus = useGlobal((s) => s.socketStatus);

    const [iconsLoaded] = useAssets([
        require('assets/adaptive-icon.png'),
        ...iconAssets,
    ]);

    let overlay: React.ReactNode = null;
    if (loading || (token && !customer) || !iconsLoaded) {
        overlay = <Connecting />;
    } else if (token && socketStatus === 'disconnected') {
        overlay = <Disconnected />;
    } else if (token && socketStatus === 'connecting') {
        overlay = <Connecting />;
    }

    if (!overlay) return children;

    return <View style={StyleSheet.absoluteFill}>{overlay}</View>;
};

function RootLayout() {
    useEffect(() => {
        Asset.fromModule(require('assets/LoginImage.jpg')).downloadAsync();
        Asset.fromModule(require('assets/BackgroundHome.jpg')).downloadAsync();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <StripeProvider
                    publishableKey={PUBLISHABLE_KEY}
                    merchantIdentifier="merchant.com.workly.services"
                    urlScheme="workly"
                >
                    <AuthProvider>
                        <SwitchAuth>
                            <Stack screenOptions={{ headerShown: false }} initialRouteName="(app)">
                                <Stack.Screen options={{ animation: 'none' }} name="(app)" />
                                <Stack.Screen options={{ animation: 'none' }} name="(auth)" />
                            </Stack>
                        </SwitchAuth>
                    </AuthProvider>
                </StripeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

export default RootLayout;
