import { z } from "zod";

/**
 * Precio "por intervalo" del form de empresa (crear / editar servicio) — ej.
 * $/noche en un hotel, $/hora en un servicio por horas.
 *
 * Reglas del backend:
 *  - unitLabel: 1-30 caracteres
 *  - unitHours: entero 1-8760 (horas en un año). Solo informativo.
 *  - maxQuantity > minQuantity
 *  - step <= maxQuantity - minQuantity
 *  - un servicio "a convenir" (`indefinite: true`) no puede tener `interval`
 *    (se valida en `ServiceDataSchema`, no aquí — este schema es solo del objeto).
 */
const intField = (min: number, max: number, label: string) =>
    z
        .number({ invalid_type_error: `${label} debe ser un número.` })
        .int(`${label} debe ser un número entero.`)
        .min(min, `${label} debe ser al menos ${min}.`)
        .max(max, `${label} es demasiado grande.`);

export const IntervalSchema = z
    .object({
        unitLabel: z
            .string()
            .trim()
            .min(1, "La unidad es obligatoria (ej. \"noche\").")
            .max(30, "La unidad es demasiado larga (máx 30)."),
        unitHours: intField(1, 8760, "La duración en horas"),
        minQuantity: intField(1, 1_000_000, "La cantidad mínima"),
        maxQuantity: intField(2, 1_000_000, "La cantidad máxima"),
        step: intField(1, 1_000_000, "El incremento"),
    })
    .superRefine((data, ctx) => {
        if (data.maxQuantity <= data.minQuantity) {
            ctx.addIssue({
                path: ["maxQuantity"],
                code: z.ZodIssueCode.custom,
                message: "La cantidad máxima debe ser mayor que la mínima.",
            });
        }
        if (data.step > data.maxQuantity - data.minQuantity) {
            ctx.addIssue({
                path: ["step"],
                code: z.ZodIssueCode.custom,
                message: "El incremento no puede ser mayor que el rango (máx − mínima).",
            });
        }
    });

export type IntervalFormData = z.infer<typeof IntervalSchema>;
