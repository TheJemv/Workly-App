export type Order = {
   numberOrder: number;
   dateCreated: string;
   deliveryDate: string;
   rating: number;
   name: string;
   delivered?: boolean;
   percentComplete?: number;

   id: string;
   createdAt: Date;
   servicePhoto: string;
   status: string;

   serviceName: string;
   serviceDescription: string;

   notes: string;
   dateRequest: string;
};
