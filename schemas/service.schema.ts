import { z } from "zod";

export const ServiceDataSchema = z.object({
    name: z.string().min(1, "Es obligatorio el nombre."),
    description: z
        .string()
        .min(45, "Es obligatorio que la descripcion sea mas de 45 caracteres.")
        .max(256, "La descripcion es demasiado larga, debe ser menos de 128 caracteres."),
    photo: z.string().min(1, "Obligatorio poner una foto al servicio."),

    currency: z.string().min(1, "Es obligatorio el tipo de Moneda."),
    category: z.string().min(1, "Es obligatorio seleccionar una categoria."),
    indefinite: z.boolean().default(false),

    // 👇 ahora es opcional
    unit_amount: z.number().nullable().optional(),
    requiresLocation: z.boolean().default(false),
}).superRefine((data, ctx) => {
    if (!data.indefinite && data.unit_amount === undefined) {
        ctx.addIssue({
            path: ["unit_amount"],
            message: "El precio es obligatorio si el servicio no es indefinido.",
            code: z.ZodIssueCode.custom,
        });
    }
}).superRefine((data, ctx) => {
    if (!data.indefinite) {
        if (data.unit_amount === undefined || data.unit_amount === null) {
            ctx.addIssue({
                path: ["unit_amount"],
                message: "El precio es obligatorio si el servicio no es indefinido.",
                code: z.ZodIssueCode.custom,
            })
        } else if (data.unit_amount < 5000) {
            ctx.addIssue({
                path: ["unit_amount"],
                message: "El precio debe ser mayor a $50.00 pesos.",
                code: z.ZodIssueCode.custom,
            })
        }
    }
})