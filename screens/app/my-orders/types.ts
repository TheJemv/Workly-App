export type Order = {
   numberOrder: number;
   dateCreated: string;
   deliveryDate: string;
   rating: number;
   name: string;
   delivered?: boolean;
   percentComplete?: number;
};
