export type Order = {
   numberOrder: number;
   dateCreated: string;
   deliveryDate: string;
   rating: number;
   name: string;
   delivered?: boolean;
   percentComplete?: number;
   agreement: boolean;

   id: string;
   createdAt: Date;
   servicePhoto: string;
   status: string;

   serviceName: string;
   serviceDescription: string;

   notes: string;
   dateRequest: string;

   billing: Billing;
};

export type Billing = {
   id: string;

   name: string;
   street: string;
   number_ext: string;
   number_int: string;
   rfc: string;
   cp: string;
   country: string;
   state: string;
   city: string;
   division: string;
   phone: string;

   createdAt: Date;
   updatedAt: Date;
};
