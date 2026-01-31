import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { StripeProvider } from "@stripe/stripe-react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { PUBLISHABLE_KEY } from "@env";
import useGlobal from "core/globals";
import { useEffect } from "react";
import { AppState } from "react-native";

import { Stack } from "expo-router";

export default function App() {
   const init = useGlobal(s => s.init);
   const socketConnect = useGlobal(s => s.socketConnect);
   const socketDisconnect = useGlobal(s => s.socketDisconnect);

   useEffect(() => {
      (async () => {
         await init();
         await socketConnect();
      })()

      const sub = AppState.addEventListener("change", (state) => {
         if (state === "active") socketConnect();
         else socketDisconnect();
      });

      return () => sub.remove();
   }, []);

   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <StripeProvider publishableKey={PUBLISHABLE_KEY}>
            <NavigationContainer>
               <AuthProvider>
                  <BottomSheetModalProvider>
                     {/* <SwitchAuth /> */}
                     <Stack />
                  </BottomSheetModalProvider>
               </AuthProvider>
            </NavigationContainer>
         </StripeProvider>
      </GestureHandlerRootView>
   )
}
