import { z } from "zod";
import { AddonSchema } from "./addon.schema";
import ServiceLocationModeEnum from "enum/ServiceLocationModeEnum";

export const ServiceDataSchema = z
    .object({
        // min 7 chars (contrato §4.1)
        name: z.string().trim().min(7, "El nombre debe tener al menos 7 caracteres."),
        description: z
            .string()
            .trim()
            .min(20, "La descripción debe tener al menos 20 caracteres.")
            .max(260, "La descripción es demasiado larga (máx 260)."),
        // Galería de 1 a 5 fotos, en orden (índice 0 = portada). Al crear son
        // data-URIs base64; al editar, mezcla de URLs de Cloudinary existentes
        // (se conservan) + data-URIs nuevos. Reemplazo total, igual que addons.
        photos: z
            .array(z.string().min(1))
            .min(1, "Sube al menos 1 foto del servicio.")
            .max(5, "Máximo 5 fotos por servicio."),

        currency: z.string().min(1, "Es obligatorio el tipo de Moneda."),
        category: z.string().min(1, "Es obligatorio seleccionar una categoria."),
        indefinite: z.boolean().default(false),

        unit_amount: z.number().nullable().optional(),

        // Reemplaza al viejo `requiresLocation: boolean`. `companyLocationId`
        // solo aplica (y es obligatorio) en modo "company_location" — ver
        // el superRefine de abajo.
        locationMode: z.nativeEnum(ServiceLocationModeEnum).default(ServiceLocationModeEnum.NotRequired),
        companyLocationId: z.string().uuid("companyLocationId debe ser un UUID válido.").nullable().optional(),

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
        // Modo "sucursal propia" exige tener una sucursal elegida (contrato:
        // companyLocationId es obligatorio si y solo si locationMode es
        // company_location; el backend igual lo valida, esto solo evita el
        // viaje redondo).
        if (data.locationMode === ServiceLocationModeEnum.CompanyLocation && !data.companyLocationId) {
            ctx.addIssue({
                path: ["companyLocationId"],
                code: z.ZodIssueCode.custom,
                message: "Selecciona la ubicación de la empresa para este servicio.",
            });
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
