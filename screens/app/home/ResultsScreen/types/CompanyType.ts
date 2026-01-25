import { ProfileType, ServiceType } from "./";

type CompanyItem = {
   id: string;
   services: ServiceType[];
   profile: ProfileType;
};

export default CompanyItem;
