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


export default function App() {
  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    if (Platform.OS === 'ios') {
    	Purchases.configure({ apiKey: "appl_qZazxMMnbtkmKyjqWyVSEIPWMTa", appUserID: null, observerMode: false, });
    } else if (Platform.OS === 'android') {
    	Purchases.configure({ apiKey: "goog_ssDaoZncWDCnymiOepnQbbijohB", appUserID: null, observerMode: false, });
}
  }, []);
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