import { DataDays } from "@/types/Schedule";
import Profile from "./Profile.types";
import { Service } from "@/types/Service"

interface CompanyType {
    id: string;
    services: Service[];
    profile: Profile;
    // Objeto único indexado por día ({ Lunes: {...}, Martes: {...}, ... }), NO un
    // arreglo — así lo consumen company.tsx, company/[id].tsx y service/[id].tsx
    // (siempre businessHours[day], nunca businessHours[0][day]).
    businessHours: DataDays;
    location?: {
        address: string;
        latitude: number;
        longitude: number;
    };
    // Cuenta de Stripe Connect (llega vía websocket, ver responseCompanyActivity
    // y responseCompanyGet en core/store/websocket/events.ts).
    account?: string;
    activity?: {
        charges_enabled?: boolean;
        payouts_enabled?: boolean;
        requirements?: {
            currently_due?: string[];
            disabled_reason?: string;
        };
        capabilities?: {
            card_payments?: string;
            transfers?: string;
        };
    };
}

export default CompanyType;