import { ApiErrorCode } from "./codes";

/** Texto genérico para 5xx / unknown. NUNCA se muestra el message crudo de un 5xx. */
export const GENERIC_MESSAGE = "Algo salió mal, intenta de nuevo.";

/** Error de red / timeout / sin internet. Distinto de un 5xx. */
export const NETWORK_MESSAGE =
   "Sin conexión. Revisa tu internet e intenta de nuevo.";

/**
 * Fallback por código cuando la API no mandó `message` mostrable (4xx conocidos).
 * En 4xx normalmente se prefiere el `message` de la API (viene en español).
 */
export const FALLBACK_BY_CODE: Partial<Record<ApiErrorCode, string>> = {
   "validation-error": "Revisa los datos del formulario.",
   "bad-request": "La solicitud no es válida.",
   "forbidden": "No tienes permiso para hacer esto.",
   "not-found": "No encontramos lo que buscas.",
   "conflict": "Hay un conflicto con el estado actual.",
   "db/duplicate": "El registro ya existe.",
   "db/fk-violation": "El registro está en uso o la referencia no es válida.",
   "db/missing-field": "Falta información requerida.",
   "db/invalid-input": "Alguno de los datos no tiene el formato correcto.",
   "rate-limit/exceeded":
      "Demasiadas peticiones. Espera un momento e intenta de nuevo.",
   "unauthorized": "Tu sesión expiró. Inicia sesión de nuevo.",
   "auth/invalid-token": "Tu sesión no es válida. Inicia sesión de nuevo.",
   "auth/id-token-expired": "Tu sesión expiró. Inicia sesión de nuevo.",
   "auth/id-token-revoked": "Tu sesión fue cerrada. Inicia sesión de nuevo.",
};

/** true = para este código se puede confiar en el `message` que manda la API. */
export const canShowApiMessage = (code: ApiErrorCode, status: number): boolean => {
   if (code === "network" || code === "unknown") return false;
   if (status >= 500) return false;
   if (code === "internal-error" || code === "db/query-failed") return false;
   return status >= 400 && status < 500;
};

export const DEFAULT_RETRY_AFTER_SECONDS = 30;
