import React, { createContext, useEffect, useRef, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { customer as getCustomer } from "services/auth/customer";
import useGlobal from "core/globals";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const setTokenGlobal = useGlobal((s) => s.setToken);
   const socketDisconnect = useGlobal((s) => s.socketDisconnect);
   const socketConnect = useGlobal((s) => s.socketConnect);

   const [user, setUser] = useState(null);
   const [token, setToken] = useState(null);
   const [customer, setCustomer] = useState(null);
   const [loading, setLoading] = useState(false);

   const isFetchingRef = useRef(false);
   const tokenRefreshIntervalRef = useRef(null);

   // 🔥 Función para refrescar el token
   const refreshToken = async (currentUser) => {
      if (!currentUser) return null;

      try {
         console.log('🔄 Refrescando token...');
         const freshToken = await currentUser.getIdToken(true); // force refresh
         setToken(freshToken);
         setTokenGlobal(freshToken);
         console.log('✅ Token refrescado exitosamente');
         return freshToken;
      } catch (error) {
         console.error('❌ Error refrescando token:', error);
         return null;
      }
   };

   // 🔥 Limpiar intervalo de refresh
   const clearTokenRefreshInterval = () => {
      if (tokenRefreshIntervalRef.current) {
         clearInterval(tokenRefreshIntervalRef.current);
         tokenRefreshIntervalRef.current = null;
      }
   };

   // 🔥 Configurar auto-refresh del token cada 50 minutos
   const setupTokenRefresh = (currentUser) => {
      clearTokenRefreshInterval();

      // Refrescar cada 50 minutos (el token expira en 60)
      tokenRefreshIntervalRef.current = setInterval(async () => {
         await refreshToken(currentUser);
      }, 50 * 60 * 1000); // 50 minutos
   };

   useEffect(() => {
      // 🔥 Listener para cambios en el token (incluye auto-refresh)
      const unsubscribeTokenChange = auth.onIdTokenChanged(async (u) => {
         if (!u) return;

         // Solo actualizar si no estamos en medio de un fetch
         if (!isFetchingRef.current) {
            try {
               const freshToken = await u.getIdToken();
               setToken(freshToken);
               setTokenGlobal(freshToken);
               console.log('🔄 Token actualizado automáticamente');
            } catch (error) {
               console.error('Error actualizando token:', error);
            }
         }
      });

      // Listener para cambios de autenticación
      const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
         setLoading(false);

         if (!u) {
            setUser(null);
            setToken(null);
            setCustomer(null);
            setTokenGlobal(null);
            socketDisconnect();
            clearTokenRefreshInterval();
            setLoading(true);
            return;
         }

         if (isFetchingRef.current) return;
         isFetchingRef.current = true;

         try {
            const t = await u.getIdToken(true); // Force refresh inicial
            setUser(u);
            setToken(t);
            setTokenGlobal(t);

            // Obtener información del customer
            const c = await getCustomer(t);
            setCustomer(c);

            // 🔥 Configurar auto-refresh del token
            setupTokenRefresh(u);

            setLoading(true);
         } catch (error) {
            console.error('Error en autenticación:', error);
            setLoading(true);
         } finally {
            isFetchingRef.current = false;
         }
      });

      // Cleanup
      return () => {
         unsubscribeAuth();
         unsubscribeTokenChange();
         clearTokenRefreshInterval();
      };
   }, []);

   // 🔥 Exponer función para refrescar manualmente
   const value = {
      user,
      token,
      customer,
      loading,
      refreshToken: () => refreshToken(user),
   };

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
};