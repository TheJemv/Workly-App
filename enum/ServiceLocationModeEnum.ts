/**
 * Modalidad de ubicación de un servicio. Reemplaza al viejo `requiresLocation`
 * (boolean). Valor tal cual viaja por la API — inglés, minúsculas.
 */
enum ServiceLocationModeEnum {
   /** No se pide ubicación. Default si el backend no manda el campo. */
   NotRequired = 'not_required',
   /** Se le pide al cliente su dirección al pagar. */
   CustomerLocation = 'customer_location',
   /** El cliente llega a una sucursal de la empresa, fijada al crear/editar el servicio. */
   CompanyLocation = 'company_location',
}

export default ServiceLocationModeEnum
