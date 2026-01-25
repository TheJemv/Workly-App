import { Profile, ServiceType, Contact } from ".";

type CompanyType = {
   id: string;
   services: ServiceType[];
   profile: Profile;
};

export default CompanyType;
