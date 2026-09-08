import { useCallback } from "react";
import { Alert } from "react-native";
import {
   FieldValues,
   Path,
   UseFormReturn,
   UseFormSetError,
} from "react-hook-form";

import { ApiError, getUserMessage, parseApiError } from "services/api/errors";

type FormLike<T extends FieldValues> =
   | UseFormReturn<T>
   | { setError: UseFormSetError<T> };

export type HandleApiErrorResult = {
   /** El error ya normalizado. */
   error: ApiError;
   /** true si el error se pintó bajo los inputs (validation-error). */
   handledAsFieldErrors: boolean;
};

export type HandleApiErrorOptions = {
   /**
    * Muestra un Alert con `getUserMessage` cuando el error NO es de validación
    * por campo (bad-request, conflict, 5xx, red…). Default: true.
    */
   alertOnGeneralError?: boolean;
   /** Título del Alert. Default: "Error". */
   alertTitle?: string;
};

/**
 * Conecta un `ApiError` (o cualquier error de red) con un formulario de
 * react-hook-form:
 *
 *  - `validation-error` → pinta cada issue bajo su input vía `setError`
 *    (usa la ruta `path.join(".")`, que coincide con la notación de RHF).
 *  - cualquier otro error → Alert con el mensaje de usuario (genérico en 5xx).
 *
 * Uso:
 * ```ts
 * const handleApiError = useApiFormErrors(form);
 * try { await postBilling(token, data); }
 * catch (e) { handleApiError(e); }
 * ```
 */
export function useApiFormErrors<T extends FieldValues>(form: FormLike<T>) {
   const { setError } = form as { setError: UseFormSetError<T> };

   return useCallback(
      (
         input: unknown,
         options: HandleApiErrorOptions = {},
      ): HandleApiErrorResult => {
         const { alertOnGeneralError = true, alertTitle = "Error" } = options;
         const error = parseApiError(input);
         const fieldErrors = error.fieldErrors ?? {};
         const entries = Object.entries(fieldErrors);

         if (error.code === "validation-error" && entries.length > 0) {
            for (const [path, message] of entries) {
               if (path === "_root") continue;
               setError(path as Path<T>, { type: "server", message });
            }
            const rootMessage = fieldErrors._root;
            if (rootMessage && alertOnGeneralError) {
               Alert.alert(alertTitle, rootMessage);
            }
            return { error, handledAsFieldErrors: true };
         }

         if (alertOnGeneralError) {
            Alert.alert(alertTitle, getUserMessage(error));
         }
         return { error, handledAsFieldErrors: false };
      },
      [setError],
   );
}

export default useApiFormErrors;
