import { useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { StripeProvider } from "@stripe/stripe-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import useGlobal from "../core/globals";
import { Background, Connecting, Disconnected } from "../components/Auth";
import { PUBLISHABLE_KEY } from "@env";

const SwitchAuth = () => {
   const router = useRouter();
   const { token, loading } = useContext(AuthContext);
   const socketStatus = useGlobal((s) => s.socketStatus);
   const onAppForeground = useGlobal((s) => s.onAppForeground);
   const [appState, setAppState] = useState(AppState.currentState);
   const appStateRef = useRef(AppState.currentState);
   const [isNavigationReady, setIsNavigationReady] = useState(false);

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

   // Esperar a que la navegación esté lista
   useEffect(() => {
      setIsNavigationReady(true);
   }, []);

   // Manejar redirecciones cuando todo esté listo
   useEffect(() => {
      if (!isNavigationReady || !loading) return;

      if (!token) {
         router.replace('/');
      } else if (socketStatus === "connected") {
         router.replace('/(app)');
      }
   }, [isNavigationReady, token, loading, socketStatus]);

   // 1. Si la app está en background/inactive
   if (appState === "background" || appState === "inactive") {
      return <Background />;
   }

   // 2. Si la autenticación NO está lista
   if (!loading) {
      return <Connecting />;
   }

   // 3. Si NO hay token (usuario no autenticado)
   if (!token) {
      return <Slot />;
   }

   // 4. Si hay token pero el socket está desconectado
   if (socketStatus === "disconnected") {
      return <Disconnected />;
   }

   // 5. Si el socket está conectando
   if (socketStatus === "connecting") {
      return <Connecting />;
   }

   // 6. Socket conectado, mostrar la app principal
   if (socketStatus === "connected") {
      return <Slot />;
   }

   // 7. Fallback
   return <Connecting />;
};

export default function RootLayout() {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <StripeProvider publishableKey={PUBLISHABLE_KEY}>
            <AuthProvider>
               <SwitchAuth />
            </AuthProvider>
         </StripeProvider>
      </GestureHandlerRootView>
   );
}