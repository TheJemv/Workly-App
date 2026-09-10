import { Company } from "types/Company";
import { Addon } from "./Addon.types";

interface Service {
    id: string;

    name: string;
    description: string;
    category: string;
    public: boolean;
    isDelete: boolean;
    photo: string;

    price: string;
    product: string;
    currency: string;
    unit_amount: number;
    indefinite: boolean;
    requiresLocation: boolean;

    /** Complementos del servicio (solo servicios de precio fijo). */
    addons?: Addon[];

    ordersCount: number;
    views: number

    createdAt: string;
    updateAt: string;

    company?: Company
}

export default Service