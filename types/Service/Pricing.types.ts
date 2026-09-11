import { AddonType } from "./Addon.types";

/**
 * Desglose de precio que devuelve el backend en `POST /service/pay/:id` (`pricing`)
 * y que queda congelado en la orden (`order.pricing`). Todo en centavos MXN.
 */

export interface ServicePricingLine {
    addonId: string;
    name: string;
    unitLabel: string;
    type?: AddonType;
    /** Cantidad incluida en el precio base. */
    minQuantity: number;
    /** Cantidad que eligió el cliente. */
    selectedQuantity: number;
    /** `selectedQuantity - minQuantity`. */
    extraUnits: number;
    pricePerExtraUnit: number;
    /** Si el cargo se repite por cada intervalo elegido (solo si el servicio maneja `interval`). */
    perInterval?: boolean;
    /** `extraUnits * pricePerExtraUnit`, antes de multiplicar por intervalos. */
    amountPerInterval: number;
    /** `amountPerInterval`, o `amountPerInterval * interval.quantity` si `perInterval`. Ya sumado en `addonsAmount`. */
    amount: number;
}

/** Desglose del precio "por intervalo" (ej. $/noche), solo si el servicio lo maneja. */
export interface ServicePricingInterval {
    unitLabel: string;
    unitHours: number;
    /** Cantidad que eligió el cliente. */
    quantity: number;
    /** Copia de `service.unit_amount` (precio de 1 intervalo) al momento de comprar. */
    unitAmount: number;
    /** `quantity * unitAmount`. Ya está incluido en `baseAmount`. */
    amount: number;
}

export interface ServicePricing {
    currency: string;
    /**
     * Copia de `service.unit_amount` al momento de comprar — o, si el servicio
     * maneja `interval`, el total del intervalo (`interval.amount`), no el
     * precio de 1 unidad.
     */
    baseAmount: number;
    /** `null` si el servicio no maneja precio por intervalo. */
    interval: ServicePricingInterval | null;
    addons: ServicePricingLine[];
    /** Suma de `addons[].amount`. */
    addonsAmount: number;
    /** Mercancía: `baseAmount + addonsAmount`. Lo que recibirá la empresa. */
    totalAmount: number;
    /** Lo que Stripe le cobra al cliente (mercancía + comisión de plataforma). */
    clientTotal: number;
    /** `clientTotal - totalAmount`. Informativo. */
    platformFee: number;
}
