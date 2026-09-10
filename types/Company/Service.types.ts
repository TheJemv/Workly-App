import { Addon } from "@/types/Service/Addon.types";

type ServiceType = {
    id: string;
    name: string;
    photo: string;
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
