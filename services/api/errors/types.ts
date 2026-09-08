import { ApiErrorCode } from "./codes";

/** Un issue individual de Zod tal cual lo manda la API en `details`. */
export type ApiErrorDetail = {
   path: (string | number)[];
   message: string;
   code?: string;
};

/** Forma cruda del body de error del contrato (status >= 400). */
export type ApiErrorPayload = {
   error?: string;
   code?: string;
   message?: string;
   requestId?: string;
   details?: ApiErrorDetail[];
};

export type ApiErrorInit = {
   code: ApiErrorCode;
   status: number;
   message: string;
   requestId?: string;
   fieldErrors?: Record<string, string>;
   retryAfterSeconds?: number;
   raw?: unknown;
};

/**
 * Error normalizado. TODO error de red de la app termina aquí antes de llegar
 * a la UI.
 *
 * Es una subclase de `Error` (para que `instanceof Error`, `recordError` de
 * Crashlytics y el código viejo que hace `(e as Error).message` sigan
 * funcionando) pero SIEMPRE se debe ramificar por `.code`, y para texto de UI
 * usar `getUserMessage(e)` — nunca `.message` directo en un 5xx.
 */
export class ApiError extends Error {
   /** Único campo por el que se debe ramificar. */
   readonly code: ApiErrorCode;
   /** Status HTTP. 0 si fue error de red / timeout / sin respuesta. */
   readonly status: number;
   /** Id de la petición para soporte (body o header X-Request-Id). */
   readonly requestId?: string;
   /** Solo en `validation-error`: { "profile.email": "..." }. */
   readonly fieldErrors?: Record<string, string>;
   /** Solo en `rate-limit/exceeded`: segundos a esperar antes de reintentar. */
   readonly retryAfterSeconds?: number;
   /** Payload original para debugging / logging. Nunca mostrar en UI. */
   readonly raw?: unknown;

   constructor(init: ApiErrorInit) {
      super(init.message);
      this.name = "ApiError";
      this.code = init.code;
      this.status = init.status;
      this.requestId = init.requestId;
      this.fieldErrors = init.fieldErrors;
      this.retryAfterSeconds = init.retryAfterSeconds;
      this.raw = init.raw;
      // mantiene `instanceof ApiError` tras transpilar a ES5
      Object.setPrototypeOf(this, ApiError.prototype);
   }
}

export const isApiError = (value: unknown): value is ApiError =>
   value instanceof ApiError ||
   (typeof value === "object" &&
      value !== null &&
      "code" in value &&
      "status" in value &&
      "message" in value &&
      (value as any).name === "ApiError");
