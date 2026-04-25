import { createContext, useEffect, useRef, useState } from "react";
import useGlobal from "core/globals";
import { customer as getCustomer } from "services/auth/customer";
import { getApp } from "@react-native-firebase/app";
import {
   getAuth,
   getIdToken,
   onIdTokenChanged,
   onAuthStateChanged,
   FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import {
   getCrashlytics,
   setUserId,
   setAttributes,
   recordError,
   log,
   setCrashlyticsCollectionEnabled,
} from "@react-native-firebase/crashlytics";

// Fuera del componente para evitar re-inicializaciones en cada render
const app = getApp();
const authInstance = getAuth(app);
const cl = getCrashlytics();

export const AuthContext = createContext<{
   user: FirebaseAuthTypes.User;
   token: string | null;
   customer: any;
   loading: boolean;
   refreshToken: () => Promise<string | null>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const setTokenGlobal = useGlobal((s) => s.setToken);
   const socketDisconnect = useGlobal((s) => s.socketDisconnect);
   const [user, setUser] = useState<any>(null);
   const [token, setToken] = useState<string | null>(null);
   const [customer, setCustomer] = useState<any>(null);
   const [loading, setLoading] = useState(true); // true = aún verificando, false = listo
   const isFetchingRef = useRef(false);
   const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

   const refreshTokenInternal = async (currentUser: any) => {
      if (!currentUser) return null;
      try {
         const freshToken = await getIdToken(currentUser, true);
         setToken(freshToken);
         setTokenGlobal(freshToken);
         return freshToken;
      } catch (e) {
         console.error("❌ Error refrescando token:", e);
         return null;
      }
   };

   const clearTokenRefreshInterval = () => {
      if (tokenRefreshIntervalRef.current) {
         clearInterval(tokenRefreshIntervalRef.current);
         tokenRefreshIntervalRef.current = null;
      }
   };

   const setupTokenRefresh = (currentUser: any) => {
      clearTokenRefreshInterval();
      tokenRefreshIntervalRef.current = setInterval(() => {
         refreshTokenInternal(currentUser);
      }, 50 * 60 * 1000);
   };

   useEffect(() => {
      // Dentro del useEffect para evitar llamadas en cada render
      setCrashlyticsCollectionEnabled(cl, true);

      const unsubscribeIdToken = onIdTokenChanged(authInstance, async (u) => {
         if (!u) return;
         if (!isFetchingRef.current) {
            try {
               const freshToken = await getIdToken(u);
               setToken(freshToken);
               setTokenGlobal(freshToken);
            } catch (e) {
               console.error("❌ Error actualizando token:", e);
            }
         }
      });

      const unsubscribeAuth = onAuthStateChanged(authInstance, async (u) => {
         if (!u) {
            setUser(null);
            setToken(null);
            setCustomer(null);
            setTokenGlobal(null);
            socketDisconnect?.();
            clearTokenRefreshInterval();
            setUserId(cl, "");
            setLoading(false); // listo, no hay usuario
            return;
         }

         if (isFetchingRef.current) return;
         isFetchingRef.current = true;

         try {
            const t = await getIdToken(u, true);
            setUser(u);
            setToken(t);
            setTokenGlobal(t);
            const c = await getCustomer(t);
            setCustomer(c);
            setupTokenRefresh(u);

            setUserId(cl, u.uid);
            setAttributes(cl, {
               phone: u.phoneNumber ?? "sin teléfono",
               name: c?.name ?? "sin nombre",
            });
            log(cl, "Usuario autenticado: " + u.uid);
         } catch (e) {
            log(cl, "Error en autenticación del usuario");
            recordError(cl, e as Error);
            console.error("❌ Error en autenticación:", e);
         } finally {
            isFetchingRef.current = false;
            setLoading(false); // listo, con o sin error
         }
      });

      return () => {
         unsubscribeAuth();
         unsubscribeIdToken();
         clearTokenRefreshInterval();
      };
   }, []);

   const value = {
      user,
      token,
      customer,
      loading,
      refreshToken: () => refreshTokenInternal(authInstance.currentUser),
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};