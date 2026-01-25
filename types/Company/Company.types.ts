import { DataDays } from "@/types/Schedule";
import Profile from "./Profile.types";
import ServiceType from "./Service.types";

interface CompanyType {
    id: string;
    services: ServiceType[];
    profile: Profile;
    businessHours: DataDays[];
}

export default CompanyType;