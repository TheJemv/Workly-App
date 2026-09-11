import type { Addon, AddonSelection, Service, ServiceInterval } from "@/types/Service";

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

/** Igual que `snapQuantity`, pero para el selector de `interval` (mismos nombres de límites). */
export function snapIntervalQuantity(interval: ServiceInterval, quantity: number): number {
    const { minQuantity, maxQuantity, step } = interval;
    const clamped = Math.min(Math.max(quantity, minQuantity), maxQuantity);
    const stepped = minQuantity + Math.round((clamped - minQuantity) / step) * step;
    return Math.min(Math.max(stepped, minQuantity), maxQuantity);
}

/** `service.interval.minQuantity` — cantidad inicial del selector de intervalo. */
export function defaultIntervalQuantity(service: Pick<Service, "interval">): number {
    return service.interval?.minQuantity ?? 1;
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
    /** `extraUnits * pricePerExtraUnit`, antes de multiplicar por intervalos. */
    amountPerInterval: number;
    /** `amountPerInterval`, o `amountPerInterval * intervalQuantity` si `addon.perInterval`. */
    amount: number;
}

/**
 * `intervalQuantity`: cantidad de intervalos elegida (ej. noches). Solo se usa
 * si el addon es `perInterval` — pásalo únicamente cuando el servicio maneja
 * `interval`; si el servicio no lo maneja, omítelo (no tiene efecto de todos
 * modos, pero evita multiplicar por una cantidad que no aplica).
 */
export function computeAddonLine(addon: Addon, quantity: number, intervalQuantity?: number): AddonLine {
    const q = snapQuantity(addon, quantity);
    const extraUnits = Math.max(0, q - addon.minQuantity);
    const amountPerInterval = extraUnits * addon.pricePerExtraUnit;
    const amount = addon.perInterval && intervalQuantity ? amountPerInterval * intervalQuantity : amountPerInterval;
    return { addon, quantity: q, extraUnits, amountPerInterval, amount };
}

export interface IntervalLine {
    interval: ServiceInterval;
    quantity: number;
    /** Precio de 1 intervalo (`service.unit_amount`). */
    unitAmount: number;
    /** `quantity * unitAmount`. */
    amount: number;
}

export function computeIntervalLine(interval: ServiceInterval, unitAmount: number, quantity: number): IntervalLine {
    const q = snapIntervalQuantity(interval, quantity);
    return { interval, quantity: q, unitAmount, amount: q * unitAmount };
}

export interface MerchandiseSubtotal {
    /** Precio base: `unit_amount`, o el total del intervalo (`intervalLine.amount`) si el servicio lo maneja. */
    baseAmount: number;
    /** `null` si el servicio no maneja precio por intervalo. */
    intervalLine: IntervalLine | null;
    lines: AddonLine[];
    addonsAmount: number;
    /** Mercancía (sin comisión de plataforma). */
    totalAmount: number;
}

/**
 * Subtotal de mercancía: precio base (intervalo si aplica, si no `unit_amount`)
 * `+ Σ (extra * pricePerExtraUnit)`. NO incluye la comisión de plataforma (el
 * cliente no la conoce).
 */
export function computeMerchandiseSubtotal(
    service: Pick<Service, "unit_amount" | "addons" | "interval">,
    selections: Record<string, number>,
    intervalQuantity?: number,
): MerchandiseSubtotal {
    const unitAmount = Math.round(service.unit_amount || 0);
    const intervalLine = service.interval
        ? computeIntervalLine(service.interval, unitAmount, intervalQuantity ?? service.interval.minQuantity)
        : null;
    const baseAmount = intervalLine ? intervalLine.amount : unitAmount;
    // Los addons `perInterval` solo se multiplican si el servicio de verdad
    // maneja intervalo (`intervalLine` no es null) — si no, `undefined`.
    const lines = (service.addons ?? []).map((addon) =>
        computeAddonLine(addon, selections[addon.id] ?? addon.minQuantity, intervalLine?.quantity),
    );
    const addonsAmount = lines.reduce((sum, l) => sum + l.amount, 0);
    return { baseAmount, intervalLine, lines, addonsAmount, totalAmount: baseAmount + addonsAmount };
}
