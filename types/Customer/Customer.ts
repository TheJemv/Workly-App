import { Location } from "@/types/Location"
import { Billing } from "@/types/Billing";
import Profile from "./Profile";

interface Customer {
    id: string;
    uid: string;
    customerId: string;
    requestCompanyId: string | null;

    billings?: Billing[];
    locations?: Location[]

    profile?: Profile

    createdAt: Date;
    updatedAt: Date;
}

export default Customer