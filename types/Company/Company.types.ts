import { DataDays } from "@/types/Schedule";
import Profile from "./Profile.types";
import { Service } from "@/types/Service"

interface CompanyType {
    id: string;
    services: Service[];
    profile: Profile;
    businessHours: DataDays[];
}

export default CompanyType;