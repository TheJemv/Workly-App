import { Customer } from "@/types/Customer";

interface Location {
    id: string;
    name: string;
    details: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
    neighborhood: string;
    street: string;
    streetNumber: string;
    latitude: string;
    longitude: string;
    deletedAt: Date | null;
    customer?: Customer;
}

export default Location