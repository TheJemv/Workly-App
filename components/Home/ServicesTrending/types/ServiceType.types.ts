interface ServiceType {
   id: string;
   name: string;
   /** @deprecated espejo de `photos[0]`. Usar `photos` (helper `serviceGallery`). */
   photo: string;
   /** Galería ordenada de 1 a 5 URLs. Índice 0 = portada. */
   photos?: string[];
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
