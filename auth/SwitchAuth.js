import AuthNavigator from "../stacks/AuthNavigator";
import AppTabs from "stacks/AppTabs";
import useGlobal from "core/globals";
import { Background, Connecting, Disconnected } from "./components";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "context/AuthContext";
import { AppState } from "react-native";

const SwitchAuth = () => {
   const { token, loading } = useContext(AuthContext); // loading=true => auth listo
   const socketStatus = useGlobal((s) => s.socketStatus);
   const onAppForeground = useGlobal((s) => s.onAppForeground);
   const handleRetrySocket = useGlobal((s) => s.handleRetrySocket);

   const [appState, setAppState] = useState(AppState.currentState);
   const appStateRef = useRef(AppState.currentState);

   useEffect(() => {
      const sub = AppState.addEventListener("change", (nextAppState) => {
         const previousAppState = appStateRef.current;
         appStateRef.current = nextAppState;
         setAppState(nextAppState);

         // 🔥 Solo ejecutar onAppForeground cuando la app pasa de background/inactive a active
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

   // 🔥 Estados de carga prioritarios
   // 1. Si la app está en background/inactive, mostrar Background
   if (appState === "background" || appState === "inactive") {
      return <Background />;
   }

   // 2. Si la autenticación NO está lista (loading=false), mostrar Connecting
   if (!loading) {
      return <Connecting />;
   }

   // 3. Si NO hay token (usuario no autenticado), mostrar Login
   if (!token) {
      return <AuthNavigator />;
   }

   // 4. Si hay token pero el socket está desconectado, mostrar Disconnected con opción de reintentar
   if (socketStatus === "disconnected") {
      return <Disconnected onRetry={handleRetrySocket} />;
   }

   // 5. Si el socket está conectando, mostrar Connecting
   if (socketStatus === "connecting") {
      return <Connecting />;
   }

   // 6. Socket conectado, mostrar la app principal
   if (socketStatus === "connected") {
      return <AppTabs />;
   }

   // 7. Fallback: si el estado del socket no es ninguno de los anteriores, mostrar Connecting
   return <Connecting />;
};

export default SwitchAuth;