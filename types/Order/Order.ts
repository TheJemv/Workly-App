import OrderStatusEnum from "enum/OrderStatusEnum";
import { Location } from "@/types/Location";
import { ServicePricing } from "@/types/Service/Pricing.types";

export type FundStatus = "HELD" | "RELEASED" | "REFUNDED";

export default interface Order {
    numberOrder: number;
    dateCreated: string;
    deliveryDate: string;
    rating: number;
    name: string;
    delivered?: boolean;
    percentComplete?: number;

    id: string;
    createdAt: Date;
    servicePhoto: string;
    status: string | OrderStatusEnum;

    serviceName: string;
    serviceDescription: string;

    notes: string;
    dateRequest: string;
    // Fecha propuesta por la empresa cuando cambia dateRequest (status DATE_MODIFIED);
    // se usa para mostrar "fecha original" tachada. Ver OrderDate.tsx.
    originalDeliveryDate?: string;

    location?: Location

    // Desglose de precio congelado al comprar (base + complementos + comisión).
    // Órdenes viejas no lo traen.
    pricing?: ServicePricing;
    // HELD = dinero retenido en la plataforma · RELEASED = pagado a la empresa · REFUNDED
    fundStatus?: FundStatus;
    // PaymentIntent id (sin `_secret_…`). Se usa para casar la orden tras pagar.
    paymentIntent?: string;
};
