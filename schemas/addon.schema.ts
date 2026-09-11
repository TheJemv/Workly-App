import { z } from "zod";

/**
 * Complemento tipo PER_UNIT del form de empresa (crear / editar servicio).
 *
 * Reglas del backend (contrato §4.1):
 *  - máx 15 addons por servicio, nombres únicos (case-insensitive) → se valida a nivel de arreglo
 *  - maxQuantity > minQuantity
 *  - step <= maxQuantity - minQuantity
 *  - pricePerExtraUnit ∈ [100, 10_000_000] centavos
 *
 * `id` es opcional: en creación no existe (lo asigna el backend); en edición se
 * conserva el `adn_…` para no romper las órdenes que lo referencian.
 */
const intField = (min: number, max: number, label: string) =>
    z
        .number({ invalid_type_error: `${label} debe ser un número.` })
        .int(`${label} debe ser un número entero.`)
        .min(min, `${label} debe ser al menos ${min}.`)
        .max(max, `${label} es demasiado grande.`);

export const PerUnitAddonSchema = z
    .object({
        id: z.string().optional(),
        type: z.literal("PER_UNIT"),
        name: z
            .string()
            .trim()
            .min(1, "El nombre del complemento es obligatorio.")
            .max(60, "El nombre es demasiado largo (máx 60)."),
        unitLabel: z
            .string()
            .trim()
            .min(1, "La unidad es obligatoria (ej. \"personas\").")
            .max(30, "La unidad es demasiado larga (máx 30)."),
        description: z
            .string()
            .trim()
            .max(200, "La descripción es demasiado larga (máx 200).")
            .optional()
            .or(z.literal("")),
        minQuantity: intField(1, 1_000_000, "La cantidad incluida"),
        maxQuantity: intField(2, 1_000_000, "La cantidad máxima"),
        step: intField(1, 1_000_000, "El incremento"),
        pricePerExtraUnit: intField(100, 10_000_000, "El precio por unidad extra"),
        // Solo importa si el servicio tiene `interval` (ej. $/noche). `false` =
        // cargo único; `true` = se repite por cada intervalo elegido.
        perInterval: z.boolean().optional().default(false),
    })
    .superRefine((data, ctx) => {
        if (data.maxQuantity <= data.minQuantity) {
            ctx.addIssue({
                path: ["maxQuantity"],
                code: z.ZodIssueCode.custom,
                message: "La cantidad máxima debe ser mayor que la incluida.",
            });
        }
        if (data.step > data.maxQuantity - data.minQuantity) {
            ctx.addIssue({
                path: ["step"],
                code: z.ZodIssueCode.custom,
                message: "El incremento no puede ser mayor que el rango (máx − incluida).",
            });
        }
    });

// Hoy solo hay un tipo de addon. Cuando exista otro, cambiar a
// `z.union([PerUnitAddonSchema, OtroAddonSchema])` (no `discriminatedUnion`,
// que no acepta esquemas con `.superRefine`).
export const AddonSchema = PerUnitAddonSchema;

export type AddonFormData = z.infer<typeof AddonSchema>;
