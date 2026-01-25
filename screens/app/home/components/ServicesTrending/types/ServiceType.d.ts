type ServiceType = {
   id: string;
   name: string;
   photo: string;
   currency: string;
   unit_amount: number;

   company: {
      profile: {
         photo: string;
      };
   };
};

export default ServiceType;
