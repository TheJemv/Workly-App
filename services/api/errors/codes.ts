/**
 * Códigos de error estables del contrato de la API workly.
 *
 * SIEMPRE se ramifica por estos códigos, NUNCA por el `message` ni por el
 * campo técnico `error`. Ver tabla completa en la doc del contrato.
 *
 * `network` y `unknown` son sintéticos (los genera el cliente, no la API):
 *   - network  → fallo de red / timeout / sin internet (status 0)
 *   - unknown  → código no reconocido o error sin forma esperada
 */
export const API_ERROR_CODES = [
   "validation-error",
   "bad-request",
   "unauthorized",
   "auth/invalid-token",
   "auth/id-token-expired",
   "auth/id-token-revoked",
   "forbidden",
   "not-found",
   "conflict",
   "db/duplicate",
   "db/fk-violation",
   "db/missing-field",
   "db/invalid-input",
   "rate-limit/exceeded",
   "internal-error",
   "db/query-failed",
   "network",
   "unknown",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

const CODE_SET = new Set<string>(API_ERROR_CODES);

export const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
   typeof value === "string" && CODE_SET.has(value);

/**
 * Status HTTP "canónico" de cada código, usado cuando el error llega sin
 * respuesta HTTP asociada (p. ej. un body suelto) para poder clasificar.
 */
export const CANONICAL_STATUS: Record<ApiErrorCode, number> = {
   "validation-error": 400,
   "bad-request": 400,
   "unauthorized": 401,
   "auth/invalid-token": 401,
   "auth/id-token-expired": 401,
   "auth/id-token-revoked": 401,
   "forbidden": 403,
   "not-found": 404,
   "conflict": 409,
   "db/duplicate": 409,
   "db/fk-violation": 409,
   "db/missing-field": 400,
   "db/invalid-input": 400,
   "rate-limit/exceeded": 429,
   "internal-error": 500,
   "db/query-failed": 500,
   "network": 0,
   "unknown": 0,
};

/** Códigos 401 que el cliente maneja de forma especial (refresh / re-login). */
export const AUTH_ERROR_CODES: ReadonlySet<ApiErrorCode> = new Set([
   "unauthorized",
   "auth/invalid-token",
   "auth/id-token-expired",
   "auth/id-token-revoked",
]);
