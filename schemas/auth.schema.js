import { z } from "zod";

export const registerSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "El email es requerido")
        .email("Formato de email inválido")
        .regex(/^\S+$/, "El email no puede contener espacios"),

    password: z
        .string()
        .trim()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña no puede exceder 100 caracteres")
        .regex(/^\S+$/, "La contraseña no puede contener espacios")
        .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
        .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),

    confirmPassword: z
        .string()
        .trim()
        .min(1, "Debes confirmar tu contraseña")
        .regex(/^\S+$/, "La contraseña no puede contener espacios")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});