interface ServiceType {
   id: string;
   name: string;
   photo: string;
   currency: string;
   unit_amount: number;
   indefinite: boolean;

   company?: {
      profile: {
         photo: string;
      };
   };
};

export default ServiceType;
