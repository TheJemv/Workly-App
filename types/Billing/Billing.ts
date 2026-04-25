import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InvoiceDataSchema } from "schemas/billing.schema"


export type Billing = z.infer<typeof InvoiceDataSchema>;
export const invoiceDataResolver = zodResolver(InvoiceDataSchema);
export const defaultInvoiceData: Billing = {
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
