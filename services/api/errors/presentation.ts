import { ApiErrorCode } from "./codes";
import { GENERIC_MESSAGE } from "./messages";
import { parseApiError } from "./parseApiError";

const isServerCode = (code: ApiErrorCode): boolean =>
   code === "internal-error" || code === "db/query-failed";

/** "ref: 099e0719" a partir del requestId completo. */
export const formatRequestRef = (requestId?: string): string | null =>
   requestId ? `ref: ${requestId.split("-")[0]}` : null;

/**
 * Texto para mostrar al usuario (toast / Alert).
 * - 5xx / unknown / network → mensaje genérico (+ "ref:" si hay requestId)
 * - 4xx conocido → el `message` normalizado de la API
 */
export function getUserMessage(input: unknown): string {
   const err = parseApiError(input);
   const isGeneric =
      err.status >= 500 || isServerCode(err.code) || err.code === "unknown";

   if (isGeneric) {
      const ref = formatRequestRef(err.requestId);
      const base = err.message || GENERIC_MESSAGE;
      return ref ? `${base}\n(${ref})` : base;
   }

   return err.message || GENERIC_MESSAGE;
}

/**
 * Errores por campo para formularios: { "name": "...", "profile.email": "..." }.
 * Vacío si no es un `validation-error`.
 */
export function getFieldErrors(input: unknown): Record<string, string> {
   const err = parseApiError(input);
   return err.fieldErrors ?? {};
}

export const hasFieldErrors = (input: unknown): boolean =>
   Object.keys(getFieldErrors(input)).length > 0;

/** ¿Conviene mostrar una pantalla/estado vacío en vez de un toast de error? */
export const isNotFound = (input: unknown): boolean =>
   parseApiError(input).code === "not-found";

/** ¿Fue un fallo de red / sin internet (distinto de un 5xx)? */
export const isNetworkError = (input: unknown): boolean =>
   parseApiError(input).code === "network";

export const isRateLimit = (input: unknown): boolean =>
   parseApiError(input).code === "rate-limit/exceeded";

/** Milisegundos a esperar antes de reintentar tras un 429. */
export const getRetryAfterMs = (input: unknown): number => {
   const err = parseApiError(input);
   return (err.retryAfterSeconds ?? 30) * 1000;
};

/** ¿El error amerita botón "reintentar"? (5xx / red) */
export const isRetryable = (input: unknown): boolean => {
   const err = parseApiError(input);
   return (
      err.code === "network" ||
      err.status >= 500 ||
      isServerCode(err.code) ||
      err.code === "rate-limit/exceeded"
   );
};
