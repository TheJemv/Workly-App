import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_HOST } from "@env";
import { getApp } from "@react-native-firebase/app";
import { getAuth, getIdToken } from "@react-native-firebase/auth";

import { parseApiError } from "./errors/parseApiError";
import { forceReLogin } from "./errors/authActions";
import { DEFAULT_RETRY_AFTER_SECONDS } from "./errors/messages";

console.log("🔑 API_HOST:", API_HOST);

/** Flags internos que ponemos en la config para acotar los reintentos. */
type RetriableConfig = InternalAxiosRequestConfig & {
   /** ya se reintentó tras refrescar el ID token (1 sola vez). */
   _tokenRetry?: boolean;
   /** ya se reintentó tras back-off por rate-limit (1 sola vez). */
   _rateLimitRetry?: boolean;
   /** fuerza `getIdToken(user, true)` en el request interceptor. */
   _forceFreshToken?: boolean;
};

const apiClient = axios.create({
   baseURL: API_HOST,
   timeout: 20000,
});

apiClient.interceptors.request.use(
   async (config: RetriableConfig) => {
      try {
         const auth = getAuth(getApp());
         const currentUser = auth.currentUser;
         if (currentUser) {
            const token = await getIdToken(currentUser, config._forceFreshToken === true);
            config.headers.Authorization = `Bearer ${token}`;
         }
      } catch (error: any) {
         console.log("⚠️ Error obteniendo token, continuando sin auth:", error?.message);
      }
      return config; // ← siempre continúa aunque falle el token
   },
   (error) => Promise.reject(parseApiError(error)),
);

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

apiClient.interceptors.response.use(
   (response) => response,
   async (error: AxiosError) => {
      const apiError = parseApiError(error);
      const config = error?.config as RetriableConfig | undefined;

      // ── 401: token expirado → refrescar ID token y reintentar 1 vez ──────────
      if (apiError.code === "auth/id-token-expired") {
         // ya se reintentó y volvió a expirar → re-login
         if (!config || config._tokenRetry) {
            await forceReLogin();
            return Promise.reject(apiError);
         }
         config._tokenRetry = true;
         config._forceFreshToken = true;
         try {
            const user = getAuth(getApp()).currentUser;
            if (user) {
               await getIdToken(user, true);
               return apiClient(config); // el request interceptor pone el token nuevo
            }
         } catch (e) {
            console.warn("[api] no se pudo refrescar el ID token:", e);
         }
         // si no hay usuario o el refresh falló → re-login
         await forceReLogin();
         return Promise.reject(apiError);
      }

      // ── 401: sesión inválida / ausente / revocada → cerrar sesión y a login ──
      if (
         apiError.code === "unauthorized" ||
         apiError.code === "auth/invalid-token" ||
         apiError.code === "auth/id-token-revoked"
      ) {
         await forceReLogin();
         return Promise.reject(apiError);
      }

      // ── 429: back-off simple, reintento único tras Retry-After ──────────────
      if (
         apiError.code === "rate-limit/exceeded" &&
         config &&
         !config._rateLimitRetry
      ) {
         config._rateLimitRetry = true;
         const seconds = apiError.retryAfterSeconds ?? DEFAULT_RETRY_AFTER_SECONDS;
         await wait(Math.min(seconds, 60) * 1000);
         return apiClient(config);
      }

      return Promise.reject(apiError);
   },
);

export default apiClient;
