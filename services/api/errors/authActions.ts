import { router } from "expo-router";
import { getApp } from "@react-native-firebase/app";
import { getAuth, signOut } from "@react-native-firebase/auth";

/**
 * Acciones de sesión que el cliente HTTP dispara ante errores 401.
 *
 * Se centraliza aquí para que `apiClient` no dependa de la capa de navegación
 * ni del AuthContext. El AuthContext puede sustituir el handler por defecto
 * con `setForceReLoginHandler` si necesita limpiar más estado.
 */

const LOGIN_ROUTE = "/(auth)/login";

let inFlight: Promise<void> | null = null;

const defaultHandler = async (): Promise<void> => {
   try {
      await signOut(getAuth(getApp()));
   } catch (e) {
      // el listener de firebase igual limpiará el estado; seguimos a login
      console.warn("[auth] signOut falló durante re-login forzado:", e);
   }
   try {
      router.replace(LOGIN_ROUTE);
   } catch (e) {
      console.warn("[auth] no se pudo navegar a login:", e);
   }
};

let handler: () => Promise<void> = defaultHandler;

export const setForceReLoginHandler = (fn: () => Promise<void>): void => {
   handler = fn;
};

/**
 * Cierra sesión y manda a login. Idempotente mientras está en curso: varias
 * peticiones que fallan con 401 a la vez disparan un solo logout.
 */
export const forceReLogin = (): Promise<void> => {
   if (!inFlight) {
      inFlight = Promise.resolve()
         .then(handler)
         .finally(() => {
            inFlight = null;
         });
   }
   return inFlight;
};
