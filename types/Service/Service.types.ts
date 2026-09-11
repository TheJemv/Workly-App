import { Company } from "types/Company";
import { Addon } from "./Addon.types";
import { ServiceInterval } from "./Interval.types";
import ServiceLocationModeEnum from "enum/ServiceLocationModeEnum";
import { CompanyLocation } from "@/types/Location";

interface Service {
    id: string;

    name: string;
    description: string;
    category: string;
    public: boolean;
    isDelete: boolean;
    /** @deprecated espejo de `photos[0]`. Usar `photos` (helper `serviceGallery`). */
    photo: string;
    /** Galería ordenada de 1 a 5 URLs. Índice 0 = portada. Fuente de verdad. */
    photos?: string[];

    price: string;
    product: string;
    currency: string;
    /** Precio del servicio. Si `interval` no es `null`, es el precio de 1 intervalo (ej. $/noche), no el total. */
    unit_amount: number;
    indefinite: boolean;
    /** `null` = precio fijo, como siempre. Si tiene valor, el servicio se cobra "por intervalo". */
    interval?: ServiceInterval | null;
    /** Reemplaza al viejo `requiresLocation: boolean`. */
    locationMode: ServiceLocationModeEnum;
    /** Solo no-null cuando `locationMode === "company_location"`. */
    companyLocation: CompanyLocation | null;

    /** Complementos del servicio (solo servicios de precio fijo). */
    addons?: Addon[];

    ordersCount: number;
    views: number

    createdAt: string;
    updateAt: string;

    company?: Company
}

export default Service