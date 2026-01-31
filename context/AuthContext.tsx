import React, { createContext, useEffect, useRef, useState } from "react";
import useGlobal from "core/globals";
import { customer as getCustomer } from "services/auth/customer";
import { getApp } from "@react-native-firebase/app";
import {
   getAuth,
   getIdToken,
   onIdTokenChanged,
   onAuthStateChanged
} from "@react-native-firebase/auth";

export const AuthContext = createContext<{
   user: any;
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
   const [loading, setLoading] = useState(false);
   const isFetchingRef = useRef(false);
   const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

   // ✅ Obtener instancia de auth correctamente
   const app = getApp();
   const authInstance = getAuth(app);

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
         setLoading(false);
         if (!u) {
            setUser(null);
            setToken(null);
            setCustomer(null);
            setTokenGlobal(null);
            socketDisconnect?.();
            clearTokenRefreshInterval();
            setLoading(true);
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
            setLoading(true);
         } catch (e) {
            console.error("❌ Error en autenticación:", e);
            setLoading(true);
         } finally {
            isFetchingRef.current = false;
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