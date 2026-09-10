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
    /** `extraUnits * pricePerExtraUnit`. */
    amount: number;
}

export interface ServicePricing {
    currency: string;
    /** Copia de `service.unit_amount` al momento de comprar. */
    baseAmount: number;
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
