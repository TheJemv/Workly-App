import { Company } from "types/Company";

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

    ordersCount: number;
    views: number

    createdAt: string;
    updateAt: string;

    company?: Company
}

export default Service