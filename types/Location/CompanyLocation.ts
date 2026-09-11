/**
 * Sucursal/local de una empresa (`/company/locations`). Mismo shape de campos
 * que la dirección de un cliente (`Location`), pero sin dueño `customer`.
 *
 * OJO: `latitude`/`longitude` llegan como STRING desde la API (ej. "19.4155000"),
 * no number — hay que parsearlas para usarlas en un mapa.
 */
interface CompanyLocation {
    id: string;
    name: string;
    details: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
    neighborhood: string;
    street: string;
    streetNumber: string;
    latitude: string;
    longitude: string;
    deletedAt: Date | null;
}

export default CompanyLocation
