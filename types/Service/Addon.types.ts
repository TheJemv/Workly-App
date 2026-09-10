/**
 * Complementos (addons) de un servicio.
 *
 * Hoy solo existe el tipo `PER_UNIT`: una cantidad con una base ya incluida en el
 * precio del servicio (`unit_amount`). Cada unidad por encima de `minQuantity`
 * cuesta `pricePerExtraUnit` (centavos).
 *
 * El backend es la ÚNICA fuente de verdad del precio. El cliente manda
 * `AddonSelection[]` (cantidad TOTAL, no el extra); nunca montos.
 */

export type AddonType = "PER_UNIT";

export interface PerUnitAddon {
    /** Lo asigna el backend (`adn_…`). Estable de por vida: las órdenes lo referencian. */
    id: string;
    type: "PER_UNIT";
    /** Visible para el cliente, ej. "Personas". */
    name: string;
    /** Minúscula, para armar frases, ej. "personas" → "+$150 por persona extra". */
    unitLabel: string;
    description?: string;
    /** Ya incluido en `unit_amount`. Es el default y el mínimo del selector. */
    minQuantity: number;
    maxQuantity: number;
    /** Incremento del selector. `(quantity - minQuantity) % step === 0`. */
    step: number;
    /** Centavos por CADA unidad por encima de `minQuantity`. */
    pricePerExtraUnit: number;
}

export type Addon = PerUnitAddon;

/** Lo que el cliente manda en `POST /service/pay/:id`. `quantity` = cantidad TOTAL. */
export interface AddonSelection {
    addonId: string;
    quantity: number;
}
