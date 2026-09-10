/**
 * Galería de fotos de un servicio (1 a 5).
 *
 * `photos: string[]` es la fuente de verdad. `photo` es legacy (espejo de
 * `photos[0]`) y solo se usa como fallback de lectura para servicios/órdenes
 * viejos. NUNCA uses `photo` directo para pintar la galería.
 */

type WithGallery = {
   photos?: string[] | null;
   photo?: string | null;
};

/** Lista ordenada de URLs de la galería. `[]` si no hay fotos. */
export function serviceGallery(service?: WithGallery | null): string[] {
   if (!service) return [];
   if (Array.isArray(service.photos) && service.photos.length > 0) {
      return service.photos.filter(Boolean) as string[];
   }
   return service.photo ? [service.photo] : [];
}

/** Portada (photos[0]) para listados, tarjetas y resultados de búsqueda. */
export function serviceCover(service?: WithGallery | null): string | undefined {
   return serviceGallery(service)[0];
}

type WithOrderGallery = {
   servicePhotos?: string[] | null;
   servicePhoto?: string | null;
};

/** Igual que `serviceGallery` pero para el snapshot de una orden. */
export function orderGallery(order?: WithOrderGallery | null): string[] {
   if (!order) return [];
   if (Array.isArray(order.servicePhotos) && order.servicePhotos.length > 0) {
      return order.servicePhotos.filter(Boolean) as string[];
   }
   return order.servicePhoto ? [order.servicePhoto] : [];
}

/** true si la URI es una foto ya subida (Cloudinary), no un data-URI nuevo. */
export const isRemotePhoto = (uri: string): boolean => /^https?:\/\//.test(uri);
