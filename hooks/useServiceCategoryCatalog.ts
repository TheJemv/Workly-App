import { useEffect, useState } from "react";

import ServiceCategoryEnum from "enum/ServiceCategoryEnum";
import { getServiceCategoryCatalog } from "services/api/services.api";

export type CategoryOption = { label: string; value: string };

// Fallback offline: el mismo enum que valida el backend. Se usa mientras carga
// el catálogo remoto o si la petición falla.
const FALLBACK_OPTIONS: CategoryOption[] = Object.values(ServiceCategoryEnum).map(
   (category) => ({ label: category, value: category }),
);

/**
 * Opciones para el selector de categoría al crear/editar un servicio.
 * Fuente de verdad: `GET /service/categories/catalog` (siempre sincronizado con
 * la validación de `POST /service`). Cae al enum local si el endpoint no responde.
 */
export function useServiceCategoryCatalog(): CategoryOption[] {
   const [options, setOptions] = useState<CategoryOption[]>(FALLBACK_OPTIONS);

   useEffect(() => {
      let alive = true;

      getServiceCategoryCatalog()
         .then(({ categories }) => {
            if (alive && categories?.length) {
               setOptions(
                  categories.map((category) => ({ label: category, value: category })),
               );
            }
         })
         .catch(() => {
            // se queda con FALLBACK_OPTIONS
         });

      return () => {
         alive = false;
      };
   }, []);

   return options;
}
