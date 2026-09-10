import { z } from "zod";
import { AddonSchema } from "./addon.schema";

export const ServiceDataSchema = z
    .object({
        // min 7 chars (contrato §4.1)
        name: z.string().trim().min(7, "El nombre debe tener al menos 7 caracteres."),
        description: z
            .string()
            .trim()
            .min(20, "La descripción debe tener al menos 20 caracteres.")
            .max(260, "La descripción es demasiado larga (máx 260)."),
        photo: z.string().min(1, "Obligatorio poner una foto al servicio."),

        currency: z.string().min(1, "Es obligatorio el tipo de Moneda."),
        category: z.string().min(1, "Es obligatorio seleccionar una categoria."),
        indefinite: z.boolean().default(false),

        unit_amount: z.number().nullable().optional(),
        requiresLocation: z.boolean().default(false),

        // Complementos. Solo para servicios de precio fijo. El backend asigna los `id`.
        addons: z.array(AddonSchema).max(15, "Máximo 15 complementos.").optional().default([]),
    })
    .superRefine((data, ctx) => {
        // Precio base obligatorio (y >= $49.99) si el servicio no es "a convenir".
        if (!data.indefinite) {
            if (data.unit_amount === undefined || data.unit_amount === null) {
                ctx.addIssue({
                    path: ["unit_amount"],
                    code: z.ZodIssueCode.custom,
                    message: "El precio es obligatorio si el servicio no es indefinido.",
                });
            } else if (data.unit_amount < 4999) {
                ctx.addIssue({
                    path: ["unit_amount"],
                    code: z.ZodIssueCode.custom,
                    message: "El precio debe ser mayor a $49.99 pesos.",
                });
            }
        }
    })
    .superRefine((data, ctx) => {
        const addons = data.addons ?? [];

        // Un servicio "a convenir" no puede tener complementos.
        if (data.indefinite && addons.length > 0) {
            ctx.addIssue({
                path: ["addons"],
                code: z.ZodIssueCode.custom,
                message: "Un servicio con precio a convenir no puede tener complementos.",
            });
        }

        // Nombres de complemento únicos (case-insensitive).
        const seen = new Set<string>();
        addons.forEach((addon, i) => {
            const key = addon.name?.trim().toLowerCase();
            if (!key) return;
            if (seen.has(key)) {
                ctx.addIssue({
                    path: ["addons", i, "name"],
                    code: z.ZodIssueCode.custom,
                    message: "Ya existe otro complemento con ese nombre.",
                });
            }
            seen.add(key);
        });
    });
