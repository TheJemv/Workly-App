import {
   ApiErrorCode,
   CANONICAL_STATUS,
   isApiErrorCode,
} from "./codes";
import {
   canShowApiMessage,
   DEFAULT_RETRY_AFTER_SECONDS,
   FALLBACK_BY_CODE,
   GENERIC_MESSAGE,
   NETWORK_MESSAGE,
} from "./messages";
import { ApiError, ApiErrorDetail, ApiErrorPayload, isApiError } from "./types";

const REQUEST_ID_HEADER = "x-request-id";

/** Lee un header sin importar si es objeto plano o AxiosHeaders. */
const readHeader = (headers: any, name: string): string | undefined => {
   if (!headers) return undefined;
   if (typeof headers.get === "function") {
      const v = headers.get(name);
      return typeof v === "string" ? v : undefined;
   }
   const lower = name.toLowerCase();
   for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === lower) {
         const v = headers[key];
         return typeof v === "string" ? v : undefined;
      }
   }
   return undefined;
};

/** "12" → 12 · fecha HTTP → segundos restantes · nada → undefined */
const parseRetryAfter = (raw: string | undefined): number | undefined => {
   if (!raw) return undefined;
   const asNumber = Number(raw);
   if (Number.isFinite(asNumber)) return Math.max(0, Math.round(asNumber));
   const asDate = Date.parse(raw);
   if (Number.isFinite(asDate)) {
      return Math.max(0, Math.round((asDate - Date.now()) / 1000));
   }
   return undefined;
};

/** details de Zod → { "profile.email": "mensaje" } */
const toFieldErrors = (
   details: ApiErrorDetail[] | undefined,
): Record<string, string> | undefined => {
   if (!Array.isArray(details) || details.length === 0) return undefined;
   const out: Record<string, string> = {};
   for (const issue of details) {
      if (!issue || typeof issue.message !== "string") continue;
      const key = Array.isArray(issue.path) ? issue.path.join(".") : "";
      const field = key.length > 0 ? key : "_root";
      // primer mensaje gana (suele ser el más relevante)
      if (!(field in out)) out[field] = issue.message;
   }
   return Object.keys(out).length > 0 ? out : undefined;
};

const looksLikePayload = (value: unknown): value is ApiErrorPayload =>
   typeof value === "object" && value !== null && !Array.isArray(value);

/** Deriva un código a partir del status cuando el body no trae `code`. */
const codeFromStatus = (status: number): ApiErrorCode => {
   switch (status) {
      case 400:
         return "bad-request";
      case 401:
         return "unauthorized";
      case 403:
         return "forbidden";
      case 404:
         return "not-found";
      case 409:
         return "conflict";
      case 429:
         return "rate-limit/exceeded";
      default:
         if (status >= 500) return "internal-error";
         if (status >= 400) return "bad-request";
         return "unknown";
   }
};

const resolveMessage = (
   code: ApiErrorCode,
   status: number,
   apiMessage: string | undefined,
): string => {
   if (code === "network") return NETWORK_MESSAGE;
   if (canShowApiMessage(code, status) && apiMessage && apiMessage.trim()) {
      return apiMessage.trim();
   }
   return FALLBACK_BY_CODE[code] ?? GENERIC_MESSAGE;
};

type BuildInput = {
   code: ApiErrorCode;
   status: number;
   apiMessage?: string;
   requestId?: string;
   details?: ApiErrorDetail[];
   retryAfterSeconds?: number;
   raw?: unknown;
};

const build = (input: BuildInput): ApiError => {
   const { code, status } = input;

   const fieldErrors =
      code === "validation-error" ? toFieldErrors(input.details) : undefined;

   const retryAfterSeconds =
      code === "rate-limit/exceeded"
         ? (input.retryAfterSeconds ?? DEFAULT_RETRY_AFTER_SECONDS)
         : undefined;

   return new ApiError({
      code,
      status,
      message: resolveMessage(code, status, input.apiMessage),
      requestId: input.requestId || undefined,
      fieldErrors,
      retryAfterSeconds,
      raw: input.raw,
   });
};

/** Normaliza un body de error del contrato (venga de HTTP o suelto). */
const fromPayload = (
   payload: ApiErrorPayload,
   status: number,
   requestId?: string,
   retryAfterSeconds?: number,
): ApiError => {
   let code: ApiErrorCode;
   if (isApiErrorCode(payload.code)) {
      code = payload.code;
   } else if (payload.code != null && `${payload.code}`.length > 0) {
      // Vino un `code`, pero no es de los que conocemos → genérico, sin ramificar.
      code = "unknown";
   } else if (status > 0) {
      // Sin `code` (contrato viejo / body raro) → derivamos del status.
      code = codeFromStatus(status);
   } else {
      code = "unknown";
   }

   const effectiveStatus = status > 0 ? status : CANONICAL_STATUS[code];

   return build({
      code,
      status: effectiveStatus,
      apiMessage: payload.message,
      requestId: requestId ?? payload.requestId,
      details: payload.details,
      retryAfterSeconds,
      raw: payload,
   });
};

const isAxiosLike = (value: any): boolean =>
   !!value &&
   typeof value === "object" &&
   (value.isAxiosError === true ||
      "config" in value ||
      "response" in value ||
      "request" in value);

const isNetworkError = (value: any): boolean => {
   const code = value?.code;
   if (code === "ECONNABORTED" || code === "ERR_NETWORK" || code === "ETIMEDOUT") {
      return true;
   }
   const msg = typeof value?.message === "string" ? value.message : "";
   return /network error|timeout|timed out|failed to fetch/i.test(msg);
};

/**
 * Normalizador central. Acepta cualquier cosa que caiga en un `catch` de una
 * llamada de red (error de axios, ApiError ya normalizado, body suelto, Error
 * genérico, undefined…) y devuelve SIEMPRE un `ApiError` válido. Nunca lanza.
 */
export function parseApiError(input: unknown): ApiError {
   // Idempotente: si ya está normalizado, se devuelve tal cual.
   if (isApiError(input)) return input;

   if (isAxiosLike(input)) {
      const err = input as any;
      const response = err.response;

      if (response) {
         const status: number = response.status ?? 0;
         const requestId = readHeader(response.headers, REQUEST_ID_HEADER);
         const retryAfterSeconds =
            status === 429
               ? parseRetryAfter(readHeader(response.headers, "retry-after"))
               : undefined;
         const data = response.data;

         if (looksLikePayload(data)) {
            return fromPayload(data, status, requestId, retryAfterSeconds);
         }

         // Respuesta no-JSON o body vacío.
         if (status >= 500 || status === 0) {
            return build({
               code: "internal-error",
               status: status || 500,
               requestId,
               raw: data,
            });
         }
         return build({
            code: codeFromStatus(status),
            status,
            requestId,
            retryAfterSeconds,
            raw: data,
         });
      }

      // Sin respuesta → error de red / timeout.
      if (isNetworkError(err) || err.request) {
         return build({ code: "network", status: 0, raw: err?.message });
      }

      return build({ code: "unknown", status: 0, raw: err?.message });
   }

   // Body de error suelto (p. ej. lo que se re-lanza en algunos wrappers).
   if (looksLikePayload(input) && ("code" in input || "message" in input)) {
      return fromPayload(input as ApiErrorPayload, 0);
   }

   if (input instanceof Error && isNetworkError(input)) {
      return build({ code: "network", status: 0, raw: input.message });
   }

   return build({ code: "unknown", status: 0, raw: input });
}
