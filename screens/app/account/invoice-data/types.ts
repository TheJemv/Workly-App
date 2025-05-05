import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const InvoiceDataSchema = z.object({
   id: z.string(),

   name: z.string().min(1, "La razon social es obligatoria"),
   street: z.string().min(1, "La calle es obligatoria"),
   number_ext: z.string().nullable(),
   number_int: z.string().nullable(),
   rfc: z.string().min(1, "El RFC es obligatorio"),
   cp: z.string().min(1, "El CP es obligatorio"),
   country: z.string().min(1, "El Pais es obligatorio"),
   state: z.string().min(1, "El estado es obligatorio"),
   city: z.string().min(1, "La ciudad es obligatorio"),
   division: z.string().min(1, "La colonia es obligatorio"),
   phone: z.string().min(1, "El teléfono es obligatorio"),
   tax_regime: z.string().min(1, "El regimen fiscal es requerido"),
});

export type InvoiceData = z.infer<typeof InvoiceDataSchema>;
export const invoiceDataResolver = zodResolver(InvoiceDataSchema);
export const defaultInvoiceData: InvoiceData = {
   id: "",

   name: "",
   street: "",
   number_ext: "",
   number_int: "",
   rfc: "",
   cp: "",
   country: "",
   state: "",
   city: "",
   division: "",
   phone: "",
   tax_regime: "",
};
