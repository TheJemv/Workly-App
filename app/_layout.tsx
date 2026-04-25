import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, AppRegistry } from 'react-native';
import { Stack } from 'expo-router';
import { Asset, useAssets } from 'expo-asset';
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider, AuthContext } from "context/AuthContext";
import useGlobal from "core/globals";
import { Connecting, Disconnected } from "../components/Auth";
import { PUBLISHABLE_KEY } from "@env";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { usePushTokenSync } from 'services/auth/notifications';
import { LogBox } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { HomeServicesData } from '@data/index';

AppRegistry.registerHeadlessTask('StripeKeepJsAwakeTask', () => async () => { });
LogBox.ignoreLogs(['SafeAreaView has been deprecated'])

GoogleSignin.configure({
    webClientId: "642547837410-p4il9usad2705bbhf6c9g97ib1109d6d.apps.googleusercontent.com",
    iosClientId: "642547837410-nhneruejr597j58c6p1v94bfunsivv0o.apps.googleusercontent.com",
});

const iconAssets = HomeServicesData.map((item) => item.Icon);

const SwitchAuth = ({ children }: { children: React.ReactNode }) => {
    usePushTokenSync();
    const { token, loading, customer } = useContext(AuthContext)!;
    const socketStatus = useGlobal((s) => s.socketStatus);  // ← sin onAppForeground


    const [assetsLoaded] = useAssets([
        require('assets/adaptive-icon.png'),
        ...iconAssets,
    ])

    let showOverlay = null;
    if (loading || (token && !customer) || !assetsLoaded) {
        showOverlay = <Connecting />;
    } else if (token && socketStatus === "disconnected") {
        showOverlay = <Disconnected />;
    } else if (token && socketStatus === "connecting") {
        showOverlay = <Connecting />;
    }

    return (
        showOverlay ? (
            <View style={StyleSheet.absoluteFill}>
                {showOverlay}
            </View>
        ) : children
    );
};



function RootLayout() {
    const [assetsReady, setAssetsReady] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            Asset.fromModule(require('assets/LoginImage.jpg')).downloadAsync(),
            Asset.fromModule(require('assets/BackgroundHome.jpg')).downloadAsync(),
        ]).finally(() => mounted && setAssetsReady(true));
        return () => { mounted = false; };
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <StripeProvider publishableKey={PUBLISHABLE_KEY} merchantIdentifier='merchant.com.workly.services' urlScheme="workly">
                    <AuthProvider>
                        <SwitchAuth>
                            <Stack screenOptions={{ headerShown: false }} initialRouteName='(app)'>
                                <Stack.Screen options={{ animation: "none" }} name='(app)' />
                                <Stack.Screen options={{ animation: "none" }} name='(auth)' />
                            </Stack>
                        </SwitchAuth>
                    </AuthProvider>
                </StripeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

export default RootLayout
