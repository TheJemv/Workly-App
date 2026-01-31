import { z } from "zod";

export const RequestDataSchema = z.object({
    name: z.string().min(6, "El nombre debe ser mayor a 6 digitos."),
    rfc: z.string().min(12, "El RFC debe ser valido.").max(14, "El RFC debe ser valido."),
    email: z.string().email("Usa un email valido."),
    phone: z.string().min(9, "Usa un numero de telefono valido").max(14, "Usa un numero de telefono valido"),
});