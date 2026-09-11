import { Addon } from "@/types/Service/Addon.types";
import { ServiceInterval } from "@/types/Service/Interval.types";
import ServiceLocationModeEnum from "enum/ServiceLocationModeEnum";
import { CompanyLocation } from "@/types/Location";

type ServiceType = {
    id: string;
    name: string;
    /** @deprecated espejo de `photos[0]`. Usar `photos` (helper `serviceGallery`). */
    photo: string;
    /** Galería ordenada de 1 a 5 URLs. Índice 0 = portada. */
    photos?: string[];
    currency: string;
    category: string;
    description: string;
    indefinite: boolean;
    /** Precio del servicio. Si `interval` no es `null`, es el precio de 1 intervalo (ej. $/noche), no el total. */
    unit_amount: number;
    /** `null` = precio fijo, como siempre. Si tiene valor, el servicio se cobra "por intervalo". */
    interval?: ServiceInterval | null;
    /** Reemplaza al viejo `requiresLocation?: boolean`. */
    locationMode?: ServiceLocationModeEnum;
    /** Solo no-null cuando `locationMode === "company_location"`. */
    companyLocation?: CompanyLocation | null;
    public?: boolean;
    addons?: Addon[];
};

export default ServiceType;
