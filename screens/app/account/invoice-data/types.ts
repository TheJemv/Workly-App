import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const InvoiceDataSchema = z.object({
   name: z.string().min(1, "El nombre es obligatorio"),
   rfc: z.string().min(1, "El RFC es obligatorio"),
   calle: z.string().min(1, "La calle es obligatorio"),
   colonia: z.string().min(1, "La colonia es obligatorio"),
   del: z.string().min(1, "El departamento es obligatorio"),
   cp: z.string().min(1, "El CP es obligatorio"),
   state: z.string().min(1, "El estado es obligatorio"),
   phone: z.string().min(1, "El teléfono es obligatorio"),
   email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("El email es incorrecto"),
   tax_regime: z.string().min(1, "El tipo de regimen fiscal es obligatorio"),
   cfdi: z.string().min(1, "El CFDI es obligatorio"),
});

export type InvoiceData = z.infer<typeof InvoiceDataSchema>;
export const invoiceDataResolver = zodResolver(InvoiceDataSchema);
export const defaultInvoiceData: InvoiceData = {
   name: "",
   rfc: "",
   calle: "",
   colonia: "",
   del: "",
   cp: "",
   state: "",
   phone: "",
   email: "",
   tax_regime: "",
   cfdi: "",
};
