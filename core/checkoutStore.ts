import { create } from "zustand";
import type { AddonSelection } from "@/types/Service";
import type { Location, CompanyLocation } from "@/types/Location";

/**
 * Borrador del checkout de un servicio. Lo llena la pantalla de detalle
 * (`service/[id].tsx`) al tocar "Continuar" y lo lee la pantalla de pago
 * (`service/checkout.tsx`), que con esto llama a `POST /service/pay/:id`.
 *
 * Aislado del store del socket (`core/globals`) a propósito: es estado efímero
 * de navegación, no datos del servidor.
 */
export interface CheckoutDraft {
    serviceId: string;
    dateRequest: string;                  // ISO
    location: string | null;              // location id — solo modo customer_location
    locationLabel?: string | null;        // texto para mostrar en el resumen
    locationData?: Location | null;       // dirección del cliente completa (customer_location)
    companyLocation?: CompanyLocation | null; // sucursal fija del servicio (company_location)
    notes: string | null;
    addonSelections: AddonSelection[];
    customPrice?: number | null;          // solo servicios indefinite
    intervalCount?: number | null;        // solo servicios con `interval` (ej. cantidad de noches)
}

interface CheckoutStore {
    draft: CheckoutDraft | null;
    setDraft: (draft: CheckoutDraft) => void;
    clear: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    draft: null,
    setDraft: (draft) => set({ draft }),
    clear: () => set({ draft: null }),
}));

export default useCheckoutStore;
