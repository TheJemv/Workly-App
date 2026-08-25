import OrderStatusEnum from "enum/OrderStatusEnum";
import { Location } from "@/types/Location";

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
};
