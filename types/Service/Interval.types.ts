/**
 * Precio "por intervalo" de un servicio (ej. $/noche en un hotel, $/hora en un
 * servicio por horas).
 *
 * `null` (o ausente) en `Service.interval` = precio fijo, como siempre. Si
 * tiene valor, `unit_amount` pasa a ser el precio de 1 intervalo, NO el precio
 * total del servicio — el total lo calcula el backend (`unit_amount * cantidad`).
 */
export interface ServiceInterval {
    /** Cómo se llama 1 unidad, la escribe la empresa. Ej. "noche", "hora". Se muestra tal cual al cliente. */
    unitLabel: string;
    /** Cuántas horas dura 1 unidad (`1` = hora, `24` = noche). Solo informativo: no calcula fecha de salida ni bloquea disponibilidad. */
    unitHours: number;
    /** Límites y paso del selector de cantidad que verá el cliente (mismos nombres que en los addons). */
    minQuantity: number;
    maxQuantity: number;
    step: number;
}

export default ServiceInterval;
