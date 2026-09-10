import { Addon } from "@/types/Service/Addon.types";

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
    unit_amount: number;
    requiresLocation?: boolean;
    public?: boolean;
    addons?: Addon[];
};

export default ServiceType;
