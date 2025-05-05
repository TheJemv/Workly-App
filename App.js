import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from "./context/AuthContext"
import SwitchAuth from './auth/SwitchAuth';
import { StripeProvider } from '@stripe/stripe-react-native';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import useGlobal from "core/globals";


export default function App() {
  const customerData = useGlobal((state) => state.customer)

  useEffect(() => {
    Purchases.configure({
      apiKey: Platform.select({
        ios: "appl_qZazxMMnbtkmKyjqWyVSEIPWMTa",
        android: "goog_ssDaoZncWDCnymiOepnQbbijohB"
      }),
      appUserID: null,
      observerMode: false,
      appUserID: customerData?.uid,
    })

    Purchases.getOfferings()
      .catch(error => {
        console.error("RevenueCat getOfferings error:", error);
      });

    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  }, [customerData]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey='pk_test_51MthNAEsa6xFgLMhTSdF55pSeJ0FFc58rtkVBjNnusMwjhdtArXwKB02WpxS6iHfDaOeHwFgOKISQoW4WJsc2omD00jIV3kVmS'>
        <NavigationContainer>
          <AuthProvider>
            <BottomSheetModalProvider>
              <SwitchAuth />
            </BottomSheetModalProvider>
          </AuthProvider>
        </NavigationContainer>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}