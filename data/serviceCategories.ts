import ServiceCategoryEnum from "enum/ServiceCategoryEnum";

/**
 * Categoría de servicio lista para pintar en el home.
 * `category` es el valor del enum tal cual viaja por la API (lo que espera
 * `GET /service?category=`), `label` es lo que se muestra al usuario.
 */
export type HomeCategory = {
   category: string;
   label: string;
   count: number;
   /** Ícono PNG local (si existe para esa categoría). */
   Icon?: number;
   /** Nombre de ícono Ionicons de respaldo cuando no hay PNG. */
   fallbackIcon?: string;
};

/** Valor del enum (string de la API) -> ícono PNG local. */
export const CATEGORY_ICON: Record<string, number> = {
   [ServiceCategoryEnum.Offices]: require("assets/Icons/Home/hammer.png"),
   [ServiceCategoryEnum.Medicine]: require("assets/Icons/Home/heartbeat.png"),
   [ServiceCategoryEnum.Recreation]: require("assets/Icons/Home/theater.png"),
   [ServiceCategoryEnum.Construction]: require("assets/Icons/Home/building.png"),
   [ServiceCategoryEnum.Marketing]: require("assets/Icons/Home/marketing.png"),
   [ServiceCategoryEnum.Law]: require("assets/Icons/Home/law.png"),
   [ServiceCategoryEnum.Education]: require("assets/Icons/Home/school.png"),
   [ServiceCategoryEnum.Gastronomy]: require("assets/Icons/Home/gastronomy.png"),
   [ServiceCategoryEnum.Programming]: require("assets/Icons/Home/coding.png"),
   [ServiceCategoryEnum.Finance]: require("assets/Icons/Home/money.png"),
   [ServiceCategoryEnum.Services]: require("assets/Icons/Home/gas.png"),
};

/** Categorías sin PNG -> ícono vectorial (Ionicons) de respaldo. */
export const CATEGORY_FALLBACK_ICON: Record<string, string> = {
   [ServiceCategoryEnum.Lodging]: "bed-outline",
};

/** Ícono usado cuando la API manda una categoría que la app aún no conoce. */
export const DEFAULT_CATEGORY_ICON = "pricetags-outline";

/** Todos los PNG de categorías, para precargarlos en el splash. */
export const CATEGORY_ICON_ASSETS: number[] = Object.values(CATEGORY_ICON);

/** Normaliza un item de `GET /service/categories` a lo que consume el home. */
export const toHomeCategory = ({
   category,
   count,
}: {
   category: string;
   count: number;
}): HomeCategory => {
   const Icon = CATEGORY_ICON[category];
   return {
      category,
      label: category,
      count,
      Icon,
      fallbackIcon: Icon
         ? undefined
         : CATEGORY_FALLBACK_ICON[category] ?? DEFAULT_CATEGORY_ICON,
   };
};
