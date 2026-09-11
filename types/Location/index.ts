import Location from "./Location"
import CompanyLocation from "./CompanyLocation"

/**
 * Campos que de verdad usan los componentes de vista previa/mapa
 * (`LocationPreview`, tarjetas de sucursal). `Location` (dirección de cliente)
 * y `CompanyLocation` (sucursal de empresa) tienen el mismo shape de campos,
 * así que ambos cumplen esto sin castear nada.
 */
export type LocationLike = Pick<
    Location,
    | "name"
    | "details"
    | "country"
    | "state"
    | "city"
    | "postalCode"
    | "neighborhood"
    | "street"
    | "streetNumber"
    | "latitude"
    | "longitude"
>;

export {
    Location,
    CompanyLocation,
}
