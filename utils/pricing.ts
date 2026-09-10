import type { Addon, AddonSelection, Service } from "@/types/Service";

/**
 * Cálculo de precio SOLO para el preview de la pantalla de configuración.
 * El total real (con comisión de plataforma) lo calcula el backend en
 * `POST /service/pay/:id` y llega en `pricing.clientTotal`.
 *
 * Todo en centavos, enteros.
 */

const MXN = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/** Formatea centavos como moneda MXN. `700000` → "$7,000.00". */
export function formatMXN(cents: number): string {
    return MXN.format((Number.isFinite(cents) ? cents : 0) / 100);
}

/** Pluraliza una unidad en español de forma aproximada. `("persona", 3)` → "personas". */
export function pluralizeUnit(label: string, n: number): string {
    const w = (label ?? "").trim();
    if (!w || n === 1) return w;
    const lower = w.toLowerCase();
    if (lower.endsWith("s")) return w;
    const last = lower[lower.length - 1];
    if ("aeiouáéíóú".includes(last)) return `${w}s`;
    if (last === "z") return `${w.slice(0, -1)}ces`;
    return `${w}es`;
}

/** Ajusta una cantidad al rango [min, max] del addon y la alinea a `step`. */
export function snapQuantity(addon: Addon, quantity: number): number {
    const { minQuantity, maxQuantity, step } = addon;
    const clamped = Math.min(Math.max(quantity, minQuantity), maxQuantity);
    const stepped = minQuantity + Math.round((clamped - minQuantity) / step) * step;
    return Math.min(Math.max(stepped, minQuantity), maxQuantity);
}

/** `{ [addonId]: minQuantity }` — estado inicial de los selectores. */
export function defaultSelections(service: Pick<Service, "addons">): Record<string, number> {
    const out: Record<string, number> = {};
    for (const addon of service.addons ?? []) out[addon.id] = addon.minQuantity;
    return out;
}

/** Convierte el mapa de selectores al arreglo que espera el backend. */
export function selectionsToArray(selections: Record<string, number>): AddonSelection[] {
    return Object.entries(selections).map(([addonId, quantity]) => ({ addonId, quantity }));
}

export interface AddonLine {
    addon: Addon;
    quantity: number;
    extraUnits: number;
    amount: number;
}

export function computeAddonLine(addon: Addon, quantity: number): AddonLine {
    const q = snapQuantity(addon, quantity);
    const extraUnits = Math.max(0, q - addon.minQuantity);
    return { addon, quantity: q, extraUnits, amount: extraUnits * addon.pricePerExtraUnit };
}

export interface MerchandiseSubtotal {
    baseAmount: number;
    lines: AddonLine[];
    addonsAmount: number;
    /** Mercancía (sin comisión de plataforma). */
    totalAmount: number;
}

/**
 * Subtotal de mercancía: `unit_amount + Σ (extra * pricePerExtraUnit)`.
 * NO incluye la comisión de plataforma (el cliente no la conoce).
 */
export function computeMerchandiseSubtotal(
    service: Pick<Service, "unit_amount" | "addons">,
    selections: Record<string, number>,
): MerchandiseSubtotal {
    const baseAmount = Math.round(service.unit_amount || 0);
    const lines = (service.addons ?? []).map((addon) =>
        computeAddonLine(addon, selections[addon.id] ?? addon.minQuantity),
    );
    const addonsAmount = lines.reduce((sum, l) => sum + l.amount, 0);
    return { baseAmount, lines, addonsAmount, totalAmount: baseAmount + addonsAmount };
}
